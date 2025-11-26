# TestNotes

Este documento describe los tests implementados en la clase `ActividadControllerMonkeyTest` y la clase base `BaseApiTest`.

## Objetivo General
Los tests están diseñados para validar el correcto funcionamiento de la API relacionada con la gestión de actividades en la aplicación **Up2Play**. Se utiliza la librería **RestAssured** para realizar peticiones HTTP y **JUnit** para las aserciones.

## Clase Base: `BaseApiTest`
- **Qué se ha hecho:**
  - Configuración inicial de la URL base (`BASE`) y autenticación mediante login.
  - Generación de datos aleatorios con `Faker` y `Random`.
- **Para qué se usa:**
  - Proporciona autenticación y configuración común para todos los tests.

## Tests en `ActividadControllerMonkeyTest`

### 1. `crearActividadYValidar`
- **Qué comprueba:**
  - Que se puede crear una actividad con datos aleatorios.
  - Que la respuesta tiene código HTTP 200 y contiene un mensaje.
- **Para qué se usa:**
  - Validar la creación de actividades en la API.

### 2. `listarActividades`
- **Qué comprueba:**
  - Que se puede obtener el listado completo de actividades.
  - Que la respuesta tiene código HTTP 200.
- **Para qué se usa:**
  - Verificar que el endpoint de listado funciona correctamente.

### 3. `unirYDesapuntarActividad`
- **Qué comprueba:**
  - Que un usuario puede unirse a una actividad existente.
  - Que el mismo usuario puede desapuntarse.
- **Para qué se usa:**
  - Validar la funcionalidad de inscripción y cancelación en actividades.

### 4. `editarActividad`
- **Qué comprueba:**
  - Que se puede editar una actividad creada por el usuario.
  - Que la respuesta tiene código HTTP 200.
- **Para qué se usa:**
  - Garantizar que la edición de actividades funciona correctamente.

## Datos Aleatorios
- Se utilizan arrays predefinidos para deportes y niveles.
- Se generan nombres, descripciones, fechas futuras y ubicaciones aleatorias para simular escenarios reales.

## Conclusión
Estos tests aseguran la correcta interacción con los endpoints principales de la API de actividades, cubriendo creación, listado, unión/desapunte y edición.
