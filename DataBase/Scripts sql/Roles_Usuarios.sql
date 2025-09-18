-- Roles
CREATE ROLE db_readwrite;

-- Permisos
GRANT SELECT, INSERT, UPDATE, DELETE ON SCHEMA :: dbo TO db_readwrite;

-- Usuarios y login
CREATE LOGIN MarcB WITH PASSWORD = 'MarcUP2Play';
CREATE USER MarcB FOR LOGIN MarcB;
ALTER ROLE db_readwrite ADD MEMBER MarcB;

CREATE LOGIN AfricaR WITH PASSWORD = 'AfricaUP2Play';
CREATE USER AfricaR FOR LOGIN AfricaR;
ALTER ROLE db_readwrite ADD MEMBER AfricaR;

CREATE LOGIN AlexV WITH PASSWORD = 'AlexUP2Play';
CREATE USER AlexV FOR LOGIN AlexV;
ALTER ROLE db_readwrite ADD MEMBER AlexV;

CREATE LOGIN DanielV WITH PASSWORD = 'DanielUP2Play';
CREATE USER DanielV FOR LOGIN DanielV;
ALTER ROLE db_readwrite ADD MEMBER DanielV;

-- Verificar que los usuarios se han creado en la Base de Datos
USE UP2PlayDB;
GO

SELECT name, type_desc, create_date
FROM sys.database_principals
WHERE type IN ('S', 'U', 'G', 'SQL_USER')
  AND name NOT LIKE '##%'; -- Excluye usuarios internos del sistema

--Verificar relación entre usuarios y logins
USE UP2PlayDB;
GO

SELECT 
    dp.name AS UsuarioBD,
    sp.name AS LoginServidor,
    sp.type_desc AS TipoLogin
FROM sys.database_principals dp
JOIN sys.server_principals sp
    ON dp.sid = sp.sid
WHERE dp.type IN ('S', 'U', 'G', 'SQL_USER');

-- Ver roles asignados a los usuarios
USE UP2PlayDB;
GO

SELECT 
    dp.name AS Usuario,
    rp.name AS Rol
FROM sys.database_role_members drm
JOIN sys.database_principals dp ON drm.member_principal_id = dp.principal_id
JOIN sys.database_principals rp ON drm.role_principal_id = rp.principal_id;
