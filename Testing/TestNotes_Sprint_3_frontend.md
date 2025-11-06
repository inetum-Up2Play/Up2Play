# Informe de Pruebas – **Frontend Up2Play**

## Control de Arquitectura (Boundaries)

Se utiliza **ESLint** junto con el plugin https://github.com/javierbrea/eslint-plugin-boundaries para garantizar la correcta estructura del proyecto:

### **Reglas principales**
- **`core`** → **no** depende de `features`.
- **`shared`** → **no** depende de `features` ni `core`.
- **`features`** → puede depender de `shared`, **no** de `core`.

### **Dentro de cada feature**
- **`pages`** → puede usar `components`, `data`, `models`.
- **`components`** → puede usar `models` (y `shared`).
- **`data`** → puede usar `models` (y `shared`).
- **`models`** → no depende del resto.

**Comando para validar:**

- npm run lint:boundaries

---

## Control de Tamaño de Bundles (angular.json)

Se definen límites para distintos tipos de archivos generados en el build:

### **Tipos de control**
- **`type: "initial"`**  
  Controla el tamaño total de los bundles iniciales cargados al arrancar la app (JS/CSS iniciales).

- **`type: "bundle", "name": "main"`**  
  Controla el tamaño del bundle específico llamado **main**.

- **`type: "anyScript"`**  
  Controla el tamaño de cualquier archivo JavaScript individual (incluye chunks lazy).

- **`type: "any"`**  
  Controla el tamaño de cualquier archivo de salida del build (scripts, estilos, assets empaquetados, etc.).

- **`type: "anyComponentStyle"`**  
  Controla el tamaño de los estilos CSS por componente (scoped al componente, no los estilos globales).

  **Comando para validar:**

- ng build
- ng build --configuration production