# ✅ Informe de Pruebas – Backend Up2Play

## 🧩 Resumen Ejecutivo
Se han ejecutado dos tipos de pruebas sobre el servicio:

- **Arranque del sistema**: verifica que la aplicación puede iniciarse correctamente.
- **Salud del sistema (Actuator)**: comprueba que los indicadores de salud responden `UP` (correcto) y el servicio está vivo y preparado para recibir tráfico.

**Resultado:** ✔️ Todas las pruebas han pasado correctamente.

---

## 🧪 Prueba 1: Arranque del sistema
**Nombre técnico:** `SkeletonContextLoadTest`

### ¿Qué valida?
Que el servicio arranca sin errores. Es un “chequeo de humo” (*smoke test*): si la aplicación no puede iniciar, este test fallaría.

### ¿Por qué es importante?
Porque asegura que la configuración básica es válida y que el servicio puede ponerse en marcha en el entorno de pruebas.

**Criterio de éxito:**
- La aplicación inicia correctamente en menos de **90 segundos**.

---

## 🩺 Pruebas 2: Salud del sistema (Spring Boot Actuator)
**Nombre técnico del conjunto:** `ActuatorHealthTest`

Estas pruebas consultan tres endpoints de monitorización estándar. Cada uno debe responder con código **200 OK** y un cuerpo con `{"status":"UP"}`.

---

### 2.1. Estado general – `/actuator/health`
**¿Qué comprueba?**
- Que el sistema, en conjunto, está sano.
- Resume el estado de diferentes componentes internos (por ejemplo, disco, base de datos, etc., según configuración).

**¿Para qué sirve?**
- Es el termómetro general de la aplicación.
- Suele usarse por herramientas de monitorización para mostrar si el servicio está operativo.

---

### 2.2. Preparación (Readiness) – `/actuator/health/readiness`
**¿Qué comprueba?**
- Si el servicio está listo para recibir tráfico real.
- Valida que las dependencias necesarias para atender peticiones (p. ej., base de datos) están listas.

**¿Para qué sirve?**
- En plataformas de despliegue (como Kubernetes), se usa para decidir si enviar tráfico a esta instancia del servicio.

---

### 2.3. Vivacidad (Liveness) – `/actuator/health/liveness`
**¿Qué comprueba?**
- Si el proceso del servicio está vivo y no bloqueado.

**¿Para qué sirve?**
- Plataformas como Kubernetes usan esta señal para reiniciar automáticamente el servicio si detectan que ha dejado de estar vivo.

**Señales de posible problema:**
- `DOWN` si el servicio entra en un estado no recuperable o queda colgado.

---

## Cómo se maneja la seguridad en los tests

En el entorno de **testing** usamos un perfil específico (`test`) que desactiva las restricciones de seguridad.  
Esto permite que las pruebas de endpoints (como los de salud del sistema) se ejecuten sin necesidad de autenticación ni validaciones adicionales.

Se logra mediante:

- Configuración temporal que **permite todas las peticiones** durante los tests.
- Desactivación de filtros de seguridad **únicamente en el contexto de pruebas**.

---

## Por qué se hace

- Las pruebas **no buscan validar la seguridad**, sino comprobar que los servicios están operativos.
- Evitar que la autenticación bloquee las pruebas automatizadas.
- Acelerar la ejecución y simplificar el mantenimiento de los tests.