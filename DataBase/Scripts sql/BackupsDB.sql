-- Backup total de la base de datos UP2Play

BACKUP DATABASE UP2PlayDB
TO DISK = 'C:\Backups\UP2PlayDB_FULL.bak'
WITH INIT, ENCRYPTION(ALGORITHM = AES_256, SERVER CERTIFICATE = CertificadoTDE);

-- Backup diferencial de la base de datos UP2PlayDB

BACKUP DATABASE UP2PlayDB
TO DISK = 'C:\Backups\UP2PlayDB_FULL.bak'
WITH DIFFERENTIAL, INIT, ENCRYPTION(ALGORITHM = AES_256, SERVER CERTIFICATE = CertificadoTDE);

-- Verificar que los backups se han realizado correctamente y que se encuentran en la ubicación especificada.
