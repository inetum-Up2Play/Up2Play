## Cambio en la Base de Datos: [Activar Certificado TDE (cifrado en reposo)]

**Fecha:** 17-09-2025  
**Autor:** Joan Juncosa-Vilaplana  
**Tipo de Cambio:** [Activación]

---

## Objetivo
Se activa Transparent Data Encryption (TDE) para cifrar archivos sql cuando entren en reposo debido a la posibilidad de contar con datos sensibles de usuarios y añadir un nivel más de seguridad.

## Descripción Técnica
- Script ejecutado: `CertifiacadoTDE.sql`
- Ubicación: `C:\Users\joan.juncosa.ext\Desktop\Up2PlayDB`
- Afecta a: `master i UP2PlayDB`

## Pruebas
- Verificar que los datos se cifran al estar en reposo y se pueden descifrar con la contraseña  configurada para el TDE.

## Próximos pasos
- Crear usuarios para cada miembro del proyecto para que puedan acceder a la Base de Datos.
