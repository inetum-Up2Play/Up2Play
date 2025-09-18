USE master;
GO

BACKUP CERTIFICATE CertificadoTDE
TO FILE = 'C:\Backups\Certifiacado.TDE.cer'
WITH PRIVATE KEY (
    FILE = 'C:\Backups\Certificado.TDE_PrivateKey.pvk',
    ENCRYPTION BY PASSWORD = 'DefensaUP2Play'
);

-- Verificar que el backup se ha realizado correctamemte y que se encuentra en la ubicación especificada
