## Cambio en la Base de Datos: [Exportación Total de la Base de Datos]

**Fecha:** 02-10-2025  
**Autor:** Joan Juncosa-Vilaplana  
**Tipo de Cambio:** [Exportación Total]

---

## Objetivo
Realizar una copia completa de seguridad de la base de datos UP2PlayDB en local mediante Oracle SQL Developer, para garantizar la recuperación total en caso de pérdida o fallo.

## Descripción Técnica
- Herramienta utilizada: Oracle SQL Developer
- Método: Exportación completa con DDL
- Ubicación destino: `C:\Users\joan.juncosa.ext\Desktop\Backups_Up2PlayDB`
- Afecta a: `UP2PlayDB`

## Pasos ejecutados
- Abrir Oracle SQL Developer.
- Conectarse a la base de datos UP2PlayDB.
- Ir a Tools > Database Export.
- Seleccionar Export DDL and Data para todas las tablas, esquemas y objetos.
- Elegir formato: Insert (.sql)
- Guardar en: `C:\Users\joan.juncosa.ext\Desktop\Backups_Up2PlayDB\`
- Ejecutar exportación y verificar que el archivo .sql se ha generado correctamente.

## Pruebas
- Importar el .sql en entorno de pruebas.
- Verificar que todas las estructuras y datos están presentes y consistentes.

## Próximos pasos
- Programar exportaciones completas mensuales.
- Documentar proceso de restauración en entorno local.