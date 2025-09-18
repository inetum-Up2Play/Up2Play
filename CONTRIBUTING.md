# **Guía para contribuir al proyecto**

Este documento establece las normas y buenas prácticas para el uso de ramas en este repositorio. Su objetivo es mantener un flujo de trabajo ordenado, reducir conflictos y facilitar la colaboración entre los miembros del equipo.

Aquí encontrarás el flujo de trabajo recomendado, las reglas básicas para contribuir correctamente y una explicación clara de la estrategia de ramas utilizada en el proyecto.

**Es fundamental leer y comprender este documento antes de comenzar a trabajar en el repositorio.**

---

## Flujo **de trabajo con protección de ramas:**

1. Crear una nueva rama a partir de develop, por ejemplo: feature/nueva-funcionalidad. **(Nunca se debe trabajar directamente en develop ni en main)**
2. Realizar los cambios.
3. Ejecutar tests.
4. Hacer git push de la rama.
5. Crear un **Pull Request** hacia develop, incluyendo una descripción clara de los cambios realizados. 
6. El equipo revisa el Pull Request y se ejecutan pruebas automáticas
7. Solo se realiza el **merge** si las pruebas pasan y hay aprobación.
8. La rama feature/nueva-funcionalidad puede eliminarse si ya no es necesaria.

---

## **Normas básicas para contribuir**

- No trabajar directamente en las ramas main ni develop.
- Se recomienda utilizar la terminal de Git Bash para tener mayor control sobre la rama activa.
- Mantener el repositorio local actualizado con la versión remota para evitar conflictos o sobrescribir código.
- Nombrar las ramas de forma clara y consistente:
    - feature/nombre - para nuevas funcionalidades
    - bugfix/nombre - para correcciones
    - hotfix/nombre  - para errores urgentes
    - release/nombre - para versiones
- Probar los cambios antes de solicitar un Pull Request.
- Utilizar siempre Pull Requests para fusionar ramas. No hacer merges directos.
- Incluir comentarios explicativos en los Pull Requests para facilitar la revisión por parte del equipo.

---

## **Estrategia de ramas**

Este proyecto sigue la estrategia de ramas GitFlow, una metodología ampliamente utilizada para gestionar el desarrollo colaborativo en equipos. A continuación se detallan las ramas utilizadas y su propósito específico:

### **main**

- Rama principal del proyecto.
- Contiene el código listo para producción, es decir, código probado, estable y preparado para ser desplegado.
- Contiene la versión estable de la app que los usuarios descargan o usan.

### **develop**

- Rama de integración para el desarrollo.
- Aquí se integran todas las funcionalidades nuevas antes de lanzar una versión.
- Es el campo de pruebas del equipo.

### **feature/***

- Ramas temporales para el desarrollo de nuevas funcionalidades.
- Se crean a partir de develop y se fusionan nuevamente en develop una vez completadas y probadas.
- Ejemplos:
    - feature/crear-plan
    - feature/estadisticas
    - feature/notificaciones
    - feature/compartir-planes
    - feature/perfil-usuario

### **bugfix/***

- Rama para corregir errores detectados en develop.
- Se crea esta rama desde develop, se corrige el error, y se fusiona de nuevo en develop.
- Ejemplo de uso: bugfix/error-actualizacion. Se usa si por ejemplo se detecta que los planes no se actualizan bien.

### **hotfix/***

- Rama para corregir errores urgentes en producción (main).
- Se crean desde main, se corrige el error y luego se fusionan tanto en main como en develop.
- Ejemplo de uso: hotfix/error-en-produccion. Por ejemplo, un usuario reporta que no puede crear planes en la versión publicada.

### **release/***

- Rama para preparar una nueva versión estable.
- Se crea desde develop, se hacen pruebas finales y ajustes.
- Se fusiona en main y develop.
