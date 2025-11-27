# Implementación de Monkey Testing con Gremlins.js en Angular

Este documento describe cómo se ha implementado **Monkey Testing** utilizando [Gremlins.js](https://github.com/marmelab/gremlins.js) en un proyecto Angular, incluyendo la configuración de entornos, comandos y estructura del código.

---

## ✅ Objetivo
Realizar pruebas de estrés en la interfaz del frontend mediante eventos aleatorios generados por Gremlins.js, asegurando la estabilidad de la aplicación.

---

## 📂 Estructura del Proyecto
- **types/gremlins.d.ts**: Archivo de definición de tipos para Gremlins.
- **services/monkey.service.ts**: Servicio que contiene la lógica para iniciar y detener el Monkey Testing.
- **components/monkey-control.component.ts**: Componente que permite activar o desactivar el test desde la interfaz.
- **angular.json**: Configuración para incluir el entorno de testing.
- **src/environments/environment.test.ts**: Archivo de entorno para pruebas.
- **app.ts**: Modificado para detectar el entorno de testing.

---

## ⚙️ Configuración del Entorno
En `angular.json` se agregó la configuración:

```json
"configurations": {
  "test": {
    "fileReplacements": [
      {
        "replace": "src/environments/environment.ts",
        "with": "src/environments/environment.test.ts"
      }
    ]
  }
}
```

## ▶️ Comandos a Utilizar
- **Desarrollo normal:**
```bash
ng serve
```

- **Entorno de Testing:**
```bash
ng serve --configuration=test
```

---

## ✅ Consideraciones
-   **En principio se debe hacer npm install y ng build.**

--Sino:
- Gremlins.js debe instalarse:
```bash
npm install gremlins --save
```
- Asegúrate de que el entorno `testing` esté correctamente configurado en `angular.json`.



                  "maximumError": "800kB"
                  "maximumError": "380kB"
                  "maximumError": "400kB"
                  "maximumError": "300kB"
                  "maximumError": "16kB"
