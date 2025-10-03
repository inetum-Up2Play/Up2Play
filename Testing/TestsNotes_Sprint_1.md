#####       TESTING SPRINT 1_25-09-2025        #####

## 🧩 Backend (Spring Boot)

- [x] **Verificación de arranque del proyecto**  
  Comprobar que la aplicación se inicia correctamente sin errores. *(20 min)*  
  _Acciones:_ instalar Java y extensión *Java Extension Pack*.

- [ ] **Verificar acceso a la base de datos** *(NO BASE DE DATOS)*  
  Confirmar que Spring Boot puede conectarse a SQL Server.

- [ ] **Credenciales y usuarios personales correctos** *(NO BASE DE DATOS)*  
  Validar que las credenciales en `application.properties` son válidas.

- [ ] **Consulta simple sobre los datos existentes** *(NO BASE DE DATOS)*  
  Ejecutar una consulta básica para verificar acceso a datos.

- [x] **Validar estructura de carpetas**  
  Comprobar que las carpetas siguen buenas prácticas (`controller`, `service`, `repository`, etc.). *(15 min)*  
  _Nota:_ Las carpetas vacías no se suben a GitHub, pero se tienen en cuenta.

- [ ] **Verificar configuración de `application.properties`** *(NO BASE DE DATOS)*  
  Confirmar que contiene configuración mínima (URL, usuario, contraseña, dialecto, etc.).

---

## 💻 Frontend (Angular)

- [x] **Verificar compilación correcta**  
  Ejecutar `ng build` para confirmar que no hay errores.  
  _Acciones:_  
  - `npm install`, `npm build`  
  - Ajuste en `angular.json`: `"maximumWarning": "600kB"` para evitar warning.

- [x] **Verificar entorno de testing operativo**  
  Ejecutar `ng test` para comprobar que los tests funcionan.  
  _Acciones:_  
  - Solucionado error `TS2305: Module '"@angular/core/testing"' has no exported member 'async'`.  
  - Instalar Chrome para ejecutar tests.

- [x] **Validar módulos y proveedores en `main.ts` y `app.config.ts`**  
  Confirmar que los módulos necesarios (`HttpClientModule`, `FormsModule`, PrimeNG, etc.) están importados.  
  _Acciones:_  
  - Añadido `import { provideHttpClient } from '@angular/common/http';` en `app.config.ts`.  
  - En Angular v21 no es necesario declarar `standalone` en componentes.

- [x] **Validar estructura de carpetas**  
  Confirmar organización por funcionalidad (`core`, `shared`, `features`, etc.).  
  _Nota:_ Carpetas vacías no se suben a GitHub.

- [x] **Validar carpeta `core` (servicios)**  
  Confirmar que los servicios están en `core`.

- [x] **Validar carpeta `shared` (componentes reutilizables)**  
  Confirmar que los componentes reutilizables están en `shared`.

---

## 🗄️ Base de Datos (SQL) *(NO BASE DE DATOS)*

- [ ] Verificar integridad de las tablas  
  - [ ] Claves primarias y foráneas  
  - [ ] Tipos de datos correctos  
- [ ] Revisar normalización  
- [ ] Revisar redundancia y duplicados  
- [ ] Revisar constraints (`NOT NULL`, `UNIQUE`, `CHECK`)  
- [ ] Validar datos insertados  
- [ ] Validar relaciones entre tablas  
- [ ] Verificar creación y restauración de backups  
- [ ] Validar consistencia de datos restaurados  
- [ ] Verificar permisos de usuarios  
- [ ] Optimización de consultas con índices  
- [ ] Probar consultas con `@DataJpaTest`  
- [ ] Comprobar datos duplicados o corruptos  

---

## 🔐 GitHub

- [x] **Validar protección de la rama `main`**  
  No se permite push directo y se requiere revisión. ✅

- [ ] **Validar protección de la rama `develop`** *(A LA ESPERA BASE DE DATOS)*

- [x] **Validar proceso de Pull Request y Merge**  
  Confirmar que se requiere revisión. ✅

- [x] **Validar estrategia de nombres de ramas**  
  Convenciones: `feature/*`, `hotfix/*`, etc. ✅

- [x] **Comprobar acceso externo a GitHub**  
  Acceso de solo lectura para externos. ✅

---

## ⚙️ Automatización de Tests (CI) *(A LA ESPERA)*

- [ ] Configurar **GitHub Actions** para ejecutar automáticamente:
  - [ ] `mvn clean install` y `mvn test` en backend.
  - [ ] `npm install`, `ng build`, `ng test`, `ng lint` en frontend.
- [ ] Validar que los workflows se ejecutan en cada PR y bloquean merge si hay errores.

