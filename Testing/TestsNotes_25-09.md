BACKEND (Spring Boot)
    - [X]Verificación de arranque del proyecto: Comprobar que la aplicación se inicia correctamente sin errores. 20min
        **instalar java y extension pack de java**
    - [**NO BASE DE DATOS**] Verificar acceso a la base de datos desde el backend: Confirmar que Spring Boot puede conectarse a SQL Server.
    - [**NO BASE DE DATOS**]Credenciales y usuarios personales correctos: Validar que las credenciales configuradas en application.properties son válidas.
    - [**NO BASE DE DATOS**]Consulta simple sobre los datos existentes: Ejecutar una consulta básica para verificar que hay acceso a los datos.
    - [X]Validar estructura de carpetas: Comprobar que las carpetas están organizadas según buenas prácticas (controller, service, repository, etc.). 15min
        **las carpetas sin archivos no se suben a github, y por eso no se ven las que faltan peró se tiene en cuenta**
    - [**NO BASE DE DATOS**]Verificar configuración de application.properties: Confirmar que contiene la configuración mínima necesaria (URL, usuario, contraseña, dialecto, etc.).

FRONTEND (Angular)
    - [X]Verificar que Angular compila correctamente: Ejecutar ng build para confirmar que no hay errores de compilación.
        **npm install, npm build**
        **Cambiado el angular.json: "maximumWarning": "600kB" para evitar un warning de carga de archivos iniciales**
    - [X]Verificar que el entorno de testing de Angular está operativo: Ejecutar ng test para comprobar que los tests funcionan.
        **solucionado error: TS2305: Module '"@angular/core/testing"' has no exported member 'async'.**
        **Para hacerlo hay que instalar Chrome.**
    - [X]Validar cada módulo y proveedor en main.ts y app.config.ts: Revisar que los módulos necesarios (como HttpClientModule, FormsModule, PrimeNG, etc.) están correctamente  importados y proporcionados mediante bootstrapApplication() y providers en app.config.ts.
        **Revision imports main.ts**
        **Añadido import: import { provideHttpClient } from '@angular/common/http'; en app.config.ts**
        **En versiones anteriores hacia falta declarar standarlone en los componentes para importarlos y demás en la v21 no.**
    - [X]Validar estructura de carpetas: Comprobar que las carpetas están organizadas por funcionalidad (core, shared, features, etc.).ç
        **las carpetas sin archivos no se suben a github, y por eso no se ven las que faltan peró se tiene en cuenta**
    - [X]Validar carpeta core (servicios): Confirmar que los servicios están ubicados en la carpeta core.
        **las carpetas sin archivos no se suben a github, y por eso no se ven las que faltan peró se tiene en cuenta**
    - [x]Validar carpeta shared (componentes reutilizables): Verificar que los componentes reutilizables están en shared.
        **las carpetas sin archivos no se suben a github, y por eso no se ven las que faltan peró se tiene en cuenta**


BASE DE DATOS (SQL)**NO BASE DE DATOS**
    - []Verificar integridad de las tablas: Comprobar que las tablas están correctamente estructuradas.
        - []Verificar claves primarias y foráneas: Validar que las relaciones están bien definidas.
        - []Verificar tipos de datos: Confirmar que los tipos de datos son adecuados para cada campo.
    - []Revisar normalización: Evaluar si las tablas están normalizadas (preferiblemente más pequeñas y específicas).
    - []Revisar redundancia y datos duplicados: Detectar si hay datos repetidos innecesariamente.
    - []Revisar constraints (NOT NULL, UNIQUE, CHECK): Validar que las restricciones están correctamente aplicadas.
    - []Validar datos insertados: Comprobar que los datos existentes son adecuados para la lógica de la aplicación.
    - []Validar relaciones entre tablas: Confirmar que las relaciones entre entidades están correctamente implementadas.
    - []Verificar creación de backups: Asegurar que se están generando copias de seguridad.
    - []Revisar restauración de backups: Comprobar que los backups se pueden restaurar correctamente.
    - []Validar consistencia de datos restaurados: Verificar que los datos restaurados son correctos y completos.
    - []Verificar permisos de usuarios: Confirmar que cada usuario tiene los permisos adecuados.
    - []Optimización de consultas con índices: Identificar consultas frecuentes que podrían beneficiarse de índices.
    - []Usar @DataJpaTest desde el backend: Probar que las consultas JPA devuelven los resultados esperados.
    - []Comprobar datos duplicados o corruptos: Validar que no hay registros erróneos o repetidos.

GITHUB
    - [X]Validar protección de la rama main: Comprobar que no se permite push directo y que se requiere revisión.
        **Correcto**
    - [**A LA ESPERA BASE DE DATOS**]Validar protección de la rama develop: Verificar que también tiene reglas de protección activadas.
    - [X]Validar proceso de Pull Request y Merge: Confirmar que se requiere revisión.
        **Correcto, (se crea un commit fantasma)**
    - [X]Validar estrategia de nombres de ramas: Comprobar que se siguen convenciones (feature/*, hotfix/*, etc.).
        **Correcto, propuesta alguna mejora**
    - [X]Comprobar acceso externo a GitHub: Verificar si alguien fuera de la organización puede modificar algo.
        **Accede al repositorio pero no puede modificar nada**

AUTOMATIZAR TEST (Integración continua) **A LA ESPERA**
- []Automatizar comandos de testing: Configurar GitHub Actions para ejecutar automáticamente:
  - []Verificar workflow bien definido: Confirmar que el archivo .yml de GitHub Actions está correctamente configurado.
    - []mvn clean install y mvn test en el backend.
    - []npm install, ng build, ng test, ng lint en el frontend.
    - []Validar que los workflows se ejecutan en cada PR y bloquean el merge si hay errores.
