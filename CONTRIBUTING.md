#Guía para contribuir al proyecto
Este documento establece las normas para el uso correcto de las ramas en este repositorio, con el objetivo de mantener un flujo de trabajo ordenado, minimizar conflictos y facilitar la colaboración entre los miembros del equipo.
_______________________________________________________________________________________________________________________________________________________

##Estrategia de ramas
Este proyecto sigue la estrategia de ramas GitFlow, una metodología ampliamente utilizada para gestionar el desarrollo colaborativo en equipos. A continuación se detallan las ramas utilizadas y su propósito específico:
###main
- Rama principal.
- Contiene el código listo para producción, es decir, código probado, estable y preparado para ser desplegado.
- Contiene la versión estable de la app que los usuarios descargan o usan
- Solo se actualiza con versiones listas **(release)** o correcciones urgentes **(hotfix)**.

####develop
- Rama de desarrollo.
- Aquí se integran todas las funcionalidades nuevas antes de lanzar una versión.
- Es el campo de pruebas del equipo.

###feature
- Rama temporal para desarrollar nuevas funcionalidades.
- Ejemplo de uso: **feature/crear-plan**. Cada persona del equipo trabaja en una funcionalidad, por ejemplo:
  - P1: feature/crear-plan
  - P2: feature/estadisticas
  - P3: feature/notificaciones
  - P4: feature/compartir-planes
  - P5: feature/perfil-usuario.
- **Rama temporal.** Cada rama se crea desde develop, se trabaja ahí, y cuando está lista y testeada, se hace un **pull request** para fusionarla en develop.

###bugfix
- Rama para corregir errores detectados en develop.
- Ejemplo de uso: **bugfix/error-de-actualización**, Se usa si por ejemplo se detecta que los planes no se actualizan bien.
- Se crea esta rama desde **develop**, se corrige el error, y se fusiona de nuevo en **develop**.

###hotfix
- Rama para corregir errores urgentes en producción **(main)**.
- Ejemplo de uso: **hotfix/error-en-produccion**. Por ejemplo, un usuario reporta que no puede crear planes en la versión publicada.
- Se crea desde **main**, se corrige el error y se fusiona en **main** y **develop**.

###release
- Rama para preparar una nueva versión.
- Se crea desde develop, se hacen pruebas finales y ajustes.
- Se fusiona en main y develop.

_______________________________________________________________________________________________________________________________________________________

##Normas básicas para contribuir
-No trabajar directamente en main ni develop. Usa ramas feature, bugfix, hotfix o release.
-Nombrar las ramas de forma clara: feature/nombre, bugfix/nombre, etc.
-Testear antes de fusionar: todas las ramas deben estar probadas antes de hacer pull request.
-Usar pull requests para fusionar ramas. No hacer merge directo.
-Comentar los cambios en los pull requests para que el equipo entienda qué se ha hecho.
