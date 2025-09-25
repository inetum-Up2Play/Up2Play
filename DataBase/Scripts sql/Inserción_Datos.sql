
-- Añadir perfiles para algunos usuarios existentes
SET IDENTITY_INSERT PERFIL ON;

INSERT INTO PERFIL (id, nombre, apellido, fotografia, telefono, sexo, fecha_nac, idiomas, id_usuario)
VALUES
(1, 'John', 'Doe', NULL, '+34123456701', 'Masculino', '1990-03-15', 'Inglés;Español', 1),
(2, 'Jane', 'Doe', NULL, '+34123456702', 'Femenino', '1988-07-22', 'Inglés;Francés', 2),
(3, 'Samantha', 'Rose', NULL, '+34123456703', 'Femenino', '1995-11-09', 'Inglés', 3),
(4, 'Michael', 'Jones', NULL, '+34123456704', 'Masculino', '1985-01-30', 'Inglés;Alemán', 4),
(5, 'Lucy', 'Potter', NULL, '+34123456705', 'Femenino', '1992-05-18', 'Inglés;Italiano', 5);

SET IDENTITY_INSERT PERFIL OFF;

-- Añadir facturas para algunos usuarios existentes
SET IDENTITY_INSERT FACTURA ON;

INSERT INTO FACTURA (id, fecha_emision, total, iva, subtotal, id_usuario)
VALUES
(1, '2025-08-01', 120.00, 21.00, 99.00, 2),
(2, '2025-08-05', 45.50, 7.56, 37.94, 4),
(3, '2025-08-10', 300.00, 63.00, 237.00, 6),
(4, '2025-08-12', 80.00, 16.80, 63.20, 8),
(5, '2025-08-15', 15.00, 3.15, 11.85, 10);

SET IDENTITY_INSERT FACTURA OFF;

-- Añadir pagos para algunas actividades y usuarios existentes
SET IDENTITY_INSERT PAGO ON;

INSERT INTO PAGO (id, fecha_pago, total, metodo_pago, estado, id_usuario, id_actividad, id_factura)
VALUES
(1, '2025-08-02', 120.00, 'Tarjeta', 'Pagado', 2, 1, 1),
(2, '2025-08-06', 45.50, 'Transferencia', 'Pagado', 4, 2, 2),
(3, '2025-08-11', 300.00, 'Tarjeta', 'En proceso', 6, 3, 3),
(4, '2025-08-13', 80.00, 'Efectivo', 'Pagado', 8, 4, 4),
(5, '2025-08-16', 15.00, 'PayPal', 'No pagado', 10, 5, 5);

SET IDENTITY_INSERT PAGO OFF;

-- Añadir notificaciones para algunos usuarios y actividades existentes
SET IDENTITY_INSERT NOTIFICACION ON;

INSERT INTO NOTIFICACION (id, titulo, descripcion, fecha, hora, leido, id_actividad, id_usuario_generador, id_pago)
VALUES
(1, 'Registro confirmado', 'Tu inscripción a la actividad ha sido confirmada.', '2025-08-02', '09:30:00', 1, 1, 2, 1),
(2, 'Pago recibido', 'Hemos recibido tu pago correctamente. Gracias.', '2025-08-06', '14:15:00', 1, 2, 4, 2),
(3, 'Pago en revisión', 'Tu pago está siendo revisado por el equipo de finanzas.', '2025-08-11', '11:00:00', 0, 3, 6, 3),
(4, 'Recordatorio de actividad', 'La actividad comienza mañana a las 10:00. Llega 15 minutos antes.', '2025-08-11', '18:00:00', 0, 4, 8, NULL),
(5, 'Pago pendiente', 'Tienes un pago pendiente que debes completar para asegurar tu plaza.', '2025-08-16', '08:45:00', 0, 5, 10, 5);

SET IDENTITY_INSERT NOTIFICACION OFF;

-- Asociar algunos perfiles con actividades existentes
INSERT INTO PERFIL_ACTIVIDAD (id_perfil, id_actividad)
VALUES
(1, 1),
(1, 2),
(2, 2),
(3, 3),
(5, 5);

-- Asociar algunos usuarios con actividades existentes
INSERT INTO USUARIO_ACTIVIDAD (id_usuario, id_actividad)
VALUES
(1, 1),
(2, 1),
(3, 3),
(4, 2),
(10, 5);

-- Agregar notificaciones a algunos usuarios
INSERT INTO USUARIO_NOTIFICACION (id_usuario, id_notificacion)
VALUES
(2, 1),
(4, 2),
(6, 3),
(8, 4),
(10, 5);