// import para que entienda TypeScript
const tsParser = require('@typescript-eslint/parser');
// Importa el plugin eslint-plugin-boundaries que usaremos para definir zonas y reglas entre ellas
const boundaries = require('eslint-plugin-boundaries');

// Exporta un array de bloques de configuración (formato Flat Config de ESLint v9)
module.exports = [
  {
    // Carpetes que ignoro
    ignores: ['dist/**', 'node_modules/**'],
  },

  // Array de reglas per 
  {
    // Selecciona todos los archivos TypeScript del repo
    files: ['**/*.ts'],
    // Opciones del lenguaje (parser, versión de ECMAScript, etc.)
    languageOptions: {
      // Interpreta TS
      parser: tsParser,
      parserOptions: {
        // No carga tsconfig.json (mas rapido)
        project: false,
        sourceType: 'module',
        // sintaxis moderna de TS
        ecmaVersion: 'latest',
      },
    },
    // Configuración para el plugin boundaries(asignar un type a cada archivo según su ruta)
    settings: {
      'boundaries/elements': [
        // core: shell global (routing raíz, interceptors, guards globales, etc.).
        { type: 'core',   pattern: 'src/app/core/**' },
        // shared: UI/utilidades reutilizables (no dependen de dominio).
        { type: 'shared', pattern: 'src/app/shared/**' },

        // Capas dentro de cada feature
        // feature:*: subdivisiones por feature (pages, components, data, models).
        { type: 'feature:pages',      pattern: 'src/app/features/**/pages/**' },
        { type: 'feature:components', pattern: 'src/app/features/**/components/**' },
        { type: 'feature:data',       pattern: 'src/app/features/**/data/**' },
        { type: 'feature:models',     pattern: 'src/app/features/**/models/**' },

        // Altres zones dins de features (si n'hi ha)
        { type: 'features', pattern: 'src/app/features/**' },
      ],
    },
    // Registro el plugin boundaries
    plugins: {
      boundaries,
    },
    // Conjunto de reglas que se aplican a los archivos TS seleccionados
    rules: {
      // Activa la regla principal del plugin boundaries: controla qué tipos pueden importar a cuáles
      'boundaries/element-types': ['error', {
        // Lo permite todo menos lo que se especifique en las reglas
        default: 'allow',
        // Mensaje de error por defecto
        message: 'Import no permitido por las reglas de arquitectura',
        // Reglas específicas entre zonas
        rules: [
          // core NO depende de features
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
    },
  },
];