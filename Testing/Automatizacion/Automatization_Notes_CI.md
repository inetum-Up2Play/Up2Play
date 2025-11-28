# 📌 CI Pipeline – Explicación Funcional

Este documento describe **qué hace el workflow de GitHub Actions** configurado para el proyecto **Up2Play**, explicando cada parte de forma funcional.

---

## ✅ Objetivo del Workflow
Automatizar validaciones y compilaciones en cada **push** a ramas importantes (`main`, `develop`, `feature/testing`).

El pipeline garantiza:
- **Frontend Angular**: arquitectura correcta, compilación sin errores.
- **Backend Spring Boot**: tests JUnit ejecutados con perfil `test` y variables seguras.

---

## 🔍 Evento que lo dispara
```yaml
on:
  push:
    branches:
      - main
      - develop
      - feature/testing
```
➡ Se ejecuta **cada vez que hay un push** en estas ramas.

---

## 🛠 Jobs del Workflow

### 1️⃣ **Job: frontend**
**Función:** Validar y compilar la aplicación Angular.

**Pasos:**
- **Checkout**: descarga el código.
- **Setup Node.js**: instala Node (versión 22.17.0 o recomendada 20).
- **Instalar dependencias**: `npm install`.
- **Lint boundaries**: valida arquitectura con ESLint + plugin boundaries.
- **Build Angular**: compila en modo producción y verifica límites de tamaño definidos en `angular.json`.

---

### 2️⃣ **Job: backend**
**Función:** Validar el backend Spring Boot.

**Pasos:**
- **Checkout**: descarga el código.
- **Setup Java**: instala Java 17 (Temurin).
- **Cache Maven**: acelera builds reutilizando dependencias.
- **Build & Test Backend**:
  - Ejecuta `mvn clean test`.
  - Usa perfil `test` para desactivar seguridad.
  - Inyecta variables de entorno (`TEST_EMAIL`, `TEST_PASSWORD`) desde **GitHub Secrets**.

---

## 🔐 Variables de entorno
Definidas en **Settings → Secrets → Actions**:
- `TEST_EMAIL`: email del usuario de pruebas.
- `TEST_PASSWORD`: contraseña del usuario de pruebas.

Estas se usan en los tests y en el arranque con perfil `test`.


## ✅ Beneficios
- **Automatización total**: no necesitas ejecutar manualmente lint, build o tests.
- **Fail-fast**: si algo falla, el pipeline se detiene.
- **Seguridad**: secretos gestionados por GitHub.