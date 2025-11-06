// eslint.config.cjs
// Flat Config para ESLint v9: solo control de arquitectura (boundaries) para TS.

// Importa el parser de TypeScript para que ESLint pueda entender archivos .ts
const tsParser = require('@typescript-eslint/parser');
// Importa el plugin eslint-plugin-boundaries que proporciona reglas para controlar imports entre capas
const boundaries = require('eslint-plugin-boundaries');

// Exporta un array de bloques de configuración (formato Flat Config de ESLint v9)
module.exports = [
  // 1) Ignorar carpetas de build/deps
  // Bloque de configuración que indica a ESLint qué rutas debe ignorar completamente
  {
    // No analizar salidas de build ni dependencias (mejora rendimiento y evita falsos positivos)
    ignores: ['dist/**', 'node_modules/**'],
  },

  // 2) Reglas para archivos TypeScript
  // Bloque de configuración que aplica solo a ficheros que coinciden con el patrón (aquí, todos los .ts)
  {
    // Selecciona todos los archivos TypeScript del repo
    files: ['**/*.ts'],
    // Opciones del lenguaje (parser, versión de ECMAScript, etc.)
    languageOptions: {
      // Define el parser a utilizar (TS) para interpretar la sintaxis de TypeScript
      parser: tsParser,
      // Configuración del parser (sin proyecto TS para máxima rapidez)
      parserOptions: {
        // No utiliza type-checking ni carga tsconfig (más rápido). Actívalo si necesitas paths/Tipos.
        // (si necesitas paths/ tipos, apunta a tsconfig en project y añade tsconfigRootDir)
        project: false,
        // Usa módulos ES (import/export)
        sourceType: 'module',
        // Permite sintaxis moderna de JS/TS
        ecmaVersion: 'latest',
      },
    },
    // Configuración específica para plugins (aquí, boundaries) que necesita conocer la estructura del repo
    settings: {
      // Definición de elementos (capas/zonas) según tu estructura
      // Mapea “tipos lógicos” a patrones de rutas; el plugin usa estos tipos en las reglas
      'boundaries/elements': [
        // Zonas transversales
        // Todo lo que esté bajo src/app/core/** pertenece al tipo "core" (shell global, interceptors, guards, etc.)
        { type: 'core',   pattern: 'src/app/core/**' },
        // Todo lo que esté bajo src/app/shared/** pertenece al tipo "shared" (UI/Utils reutilizables)
        { type: 'shared', pattern: 'src/app/shared/**' },

        // Capas dentro de cada feature
        // Rutas de páginas enroutables dentro de cualquier feature
        { type: 'feature:pages',      pattern: 'src/app/features/**/pages/**' },
        // Componentes internos de las features (UI “tonta” preferiblemente)
        { type: 'feature:components', pattern: 'src/app/features/**/components/**' },
        // Servicios de datos/HTTP de cada feature
        { type: 'feature:data',       pattern: 'src/app/features/**/data/**' },
        // Modelos/Interfaces del dominio de cada feature
        { type: 'feature:models',     pattern: 'src/app/features/**/models/**' },

        // Macro-agrupador de cualquier cosa en features (útil para reglas de zona)
        { type: 'features', pattern: 'src/app/features/**' },
      ],
    },
    // Registro de plugins disponibles en este bloque (clave = nombre del plugin usado en reglas)
    plugins: {
      // Registra el plugin boundaries para poder usar 'boundaries/...' en rules
      boundaries, // registra el plugin con el nombre 'boundaries'
    },
    // Conjunto de reglas que se aplican a los archivos .ts seleccionados
    rules: {
      // Reglas entre zonas principales
      // Activa la regla principal del plugin boundaries: controla qué tipos pueden importar a cuáles
      'boundaries/element-types': ['error', {
        // Modo permisivo por defecto; solo se restringe lo que declaras en 'rules'
        default: 'allow',
        // Mensaje que mostrará ESLint cuando un import viole alguna de estas reglas
        message: 'Import no permitido por las reglas de arquitectura',
        // Lista de reglas entre "from" (origen) y "allow/disallow" (destino)
        rules: [
          // core NO depende de features (shared permitido si lo necesitas)
          // Evita acoplar el shell global con dominios de negocio
          { from: ['core'],   disallow: ['features'] },

          // shared NO depende de features ni core (transversal)
          // shared debe ser reutilizable, sin referencias a capas de dominio ni shell
          { from: ['shared'], disallow: ['features', 'core'] },

          // features puede usar shared, pero NO core
          // evita que una feature llame directamente a código del shell
          { from: ['features'], disallow: ['core'] },

          // Reglas dentro de cada feature
          // Las páginas pueden orquestar componentes, datos y modelos, y apoyarse en shared
          { from: ['feature:pages'],      allow: ['feature:components', 'feature:data', 'feature:models', 'shared'] },
          // Los componentes de UI dependen de modelos y utilidades compartidas (no de servicios de datos, salvo que lo permitas)
          { from: ['feature:components'], allow: ['feature:models', 'shared'] },
          // Los servicios de datos dependen de modelos (tipos) y utilidades compartidas
          { from: ['feature:data'],       allow: ['feature:models', 'shared'] },
          // Los modelos deben estar limpios (no dependen de otras capas de la feature)
          { from: ['feature:models'],     disallow: ['feature:pages', 'feature:components', 'feature:data'] },
        ],
      }],

      // (Opcional) bloquear deep imports entre features si expones public API por feature
      // Regla de ESLint para evitar imports internos a carpetas profundas de otras features (si usas index.ts público)
      // 'no-restricted-imports': ['error', {
      //   patterns: [
      //     { group: ['src/app/features/*/*/**'], message: 'Evita imports profundos entre features' }
      //   ]
      // }],
    },
  },
];