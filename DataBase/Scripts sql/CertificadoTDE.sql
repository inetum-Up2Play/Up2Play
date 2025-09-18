-- Crear master key
USE master;
CREATE MASTER KEY ENCRYPTION BY PASSWORD = 'DefensaUP2Play';
GO

-- Crear certificado
CREATE CERTIFICATE CertificadoTDE WITH SUBJECT = 'Certificado para TDE';
GO

-- Verificar que el cifrado existe y está activo
SELECT name, subject, expiry_date
FROM sys.certificates
WHERE name = 'CertifiacadoTDE';


-- Crear DEK y habilitar TDE
USE UP2PlayDB;
CREATE DATABASE ENCRYPTION KEY
WITH ALGORITHM = AES_256
ENCRYPTION BY SERVER CERTIFICATE CertificadoTDE;
ALTER DATABASE UP2PlayDB SET ENCRYPTION ON;
GO

-- Verificar estado de cifrado
SELECT
    db.name AS DatabaseName,
    dm.encryption_state AS EncryptionState,
    dm.encryptor_type AS EncryptorType,
    dm.key_algorithm AS KeyAlgorithm,
    dm.key_length AS KeyLength,
    dm.create_date AS KeyCreateDate
FROM sys.dm_database_encryption_keys dm
JOIN sys.databases db ON dm.database_id = db.database_id
WHERE db.name = 'UP2PlayDB';

