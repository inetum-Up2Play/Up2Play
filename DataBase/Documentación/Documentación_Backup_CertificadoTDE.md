## Cambio en la Base de Datos: [Copia de seguridad del certificado y su clave privada]

**Fecha:** 17-09-2025  
**Autor:** Joan Juncosa-Vilaplana  
**Tipo de Cambio:** [Backup]

---

## Objetivo
Para evitar riesgos de perdida de datos, se realiza una copia de seguridad del certificado y de su clave privada.

## Descripción Técnica
- Script ejecutado: `Backup_CertifiacadoTDE.sql`
- Ubicación: `C:\Users\joan.juncosa.ext\Desktop\Up2PlayDB`
- Afecta a: `master`

## Pruebas
- Verificar que los datos se cifran al estar en reposo y se pueden descifrar con la contraseña configurada para el TDE.

## Próximos pasos
- Crear usuarios para cada miembro del proyecto para que puedan acceder a la Base de Datos.
