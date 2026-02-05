# **Guía para contribuir al proyecto**

Este documento establece las normas y buenas prácticas para el uso de ramas en este repositorio. Su objetivo es mantener un flujo de trabajo ordenado, reducir conflictos y facilitar la colaboración entre los miembros del equipo.

Aquí encontrarás el flujo de trabajo recomendado, las reglas básicas para contribuir correctamente y una explicación clara de la estrategia de ramas utilizada en el proyecto.

**Es fundamental leer y comprender este documento antes de comenzar a trabajar en el repositorio.**

---

## Flujo **de trabajo con protección de ramas:**



1. Partimos de la rama **develop** y creamos rama **feature**.
    - **git checkout develop** -> para posicionarte en rama develop.
    - **git fetch** , **git pull origin develop** -> para actualizar datos del repositorio remoto.
    - **git checkout -b feature/funcionalidad** -> crear y posicionarse en rama feature.

2. Realizar los cambios.
    - Realizar cambios en el código.
    - **git add .** -> para marcar los cambios que van a ser incluidos para commitear.
    - **git commit -m** "Descripción clara del cambio".
    - **git push origin feature/funcionalidad** -> Subir cambios que se van realizando de la rama feature al repositorio remoto.

3. Crear Pull Request hacia develop
    Una vez la funcionalidad de la rama esté acabada y testeada, se hace un **Pull Request** desde feature a develop.

4. Otra persona del equipo revisará el código y una vez aprovado se hará un merge a develop.

5. La rama feature/funcionalidad puede eliminarse si ya no es necesaria.

6. Cuanto la applicación esté lista para desplegarse y ser usada por clientes reales, dse hará un merge de develop a main.

---
## Convención de nombres

Las convenciones de nombres son esenciales para mantener la organización y claridad en los proyectos, facilitando la colaboración y el seguimiento de cambios.

### Ramas:

- **feature** → feature/nombre-descriptivo-funcionalidad.
    
    Ejemplos: feature/login-usuario, feature/mejoras-ui
    
- **hotfix** → hotfix/descripcion-arreglo.
    
    Ejemplo: hotfix/error-login
    
- **release** → release/vX.Y.Z o release/nombre-version
    
    Ejemplo: release/v1.2.0
    

### Commits:

- **feat**: Nueva funcionalidad. **Ejemplo** → feat: añadir pantalla de registro
- **fix**: Corrección de errores. **Ejemplo** → fix: corregir validación de email
- **docs**: Cambios en documentación. **Ejemplo** → docs: actualizar README con instrucciones de instalación
- **refactor**: Reestructuración del código sin cambiar funcionalidad, como cambios de nombre de variables o funciones.  **Ejemplo →** refactor: simplificar lógica de autenticación
- **style**: Cambios de formato, tabulaciones, espacios o puntos y coma, etc; no afectan al usuario.  **Ejemplo →**  style: eliminar espacios innecesarios en funciones
- **test**: Añadir o modificar pruebas.   **Ejemplo** → test: añadir pruebas unitarias para el componente Login
- **chore**: Describir cambios que no afectan directamente el código de producción o los archivos de prueba. Ideal para tareas de mantenimiento, configuraciones o actualizaciones que no introducen nuevas funcionalidades ni corrigen errores. (actualizar dependencias y  configuración.). **Ejemplo** → chore: actualizar dependencias en package.json
- **perf**: Mejoras de rendimiento. **Ejemplo** → perf: reducir tiempo de carga en la pantalla de inicio
- **ci**: Cambios en scripts, workflows o configuración de CI/CD. **Ejemplo** → ci: añadir workflow de GitHub Actions para test
    
    **Importante**:
    
    - Usa el **modo imperativo**: “añadir” en lugar de “añadido”.
    - Sé **breve pero claro**: máximo 50 caracteres en el título.
    - Si necesitas más detalle, añade una descripción en el cuerpo del commit.

### **Comentarios en el código**

- Comenta el código de manera clara y directa explicando el porqué de esa acción.
- Evita comentarios innecesarios como // incrementa x en 1 si el código ya lo dice.
- Ejemplo:
    
    // Este método se usa para validar tokens expirados antes de renovar sesión
    function validarToken() { ... }
    
### Generales

- **Usar Guiones**: Se recomienda usar guiones para separar palabras en lugar de espacios.
- **Mantenerlo Corto y Descriptivo**: Los nombres deben ser fáciles de escribir y entender, transmitiendo la información necesaria.
- **Minúsculas**: Usar letras minúsculas para evitar confusiones, ya que Git distingue entre mayúsculas y minúsculas.
- **Evita caracteres especiales.**
- **Comando para actualizar ramas borradas.**: Primero realizar `git fetch -p`y luego `git branch -vv | grep 'origin/.*: gone]' | awk '{print $1}' | xargs git branch -D`
---

## **Normas básicas para contribuir**
- Hacer todos los días un push para que el repositorio remoto este actualizado y no se pierda información.
- Antes de empezar a trabajar cada dia hacer un git fetch y git pull para trabajar sobre código acutalizado
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
