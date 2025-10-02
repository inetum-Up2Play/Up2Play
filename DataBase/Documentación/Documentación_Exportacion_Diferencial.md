## Cambio en la Base de Datos: [Exportación Diferencial de Tablas y Datos Modificados]

**Fecha:** 02-10-2025
**Autor:** Joan Juncosa-Vilaplana
**Tipo de Cambio:** [Exportación Diferencial]

---

## Objetivo
Exportar únicamente las tablas y datos creados o modificados desde el último backup completo, para mantener una copia incremental en local.

## Descripción Técnica
- Herramienta utilizada: Oracle SQL Developer
- Método: Exportación selectiva con filtros por fecha de modificación o tablas específicas
- Ubicación destino: `C:\Users\joan.juncosa.ext\Desktop\Backups_Up2PlayDB`
- Afecta a: UP2PlayDB

## Pasos ejecutados
- Identificar tablas modificadas desde el último backup completo (consultando campos LAST_UPDATED o CREATED_DATE).
- Ir a Tools > Database Export
- Seleccionar solo las tablas afectadas.
- Guardar en:  `C:\Users\joan.juncosa.ext\Desktop\Backups_Up2PlayDB\`
- Exportar como .dmp o .sql según necesidad.

## Pruebas
- Importar el archivo en entorno de pruebas y verificar que los datos modificados están presentes.
- Validar integridad referencial y consistencia con el backup completo.

## Próximos pasos
- Automatizar exportaciones diferenciales semanales.
- Registrar cambios en control de versiones.