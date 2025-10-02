
-- Añadir perfiles para algunos usuarios existentes
INSERT ALL
  INTO PERFIL (nombre, apellido, fotografia, telefono, sexo, fecha_nac, idiomas, id_usuario) VALUES 
    ('John', 'Doe', NULL, '+34123456701', 'Masculino', TO_DATE('1990-03-15', 'YYYY-MM-DD'), 'Inglés;Español', 1)
  INTO PERFIL VALUES 
    ('Jane', 'Doe', NULL, '+34123456702', 'Femenino', TO_DATE('1988-07-22', 'YYYY-MM-DD'), 'Inglés;Francés', 2)
  INTO PERFIL VALUES 
    ('Samantha', 'Rose', NULL, '+34123456703', 'Femenino', TO_DATE('1995-11-09', 'YYYY-MM-DD'), 'Inglés', 3)
  INTO PERFIL VALUES 
    ('Michael', 'Jones', NULL, '+34123456704', 'Masculino', TO_DATE('1985-01-30', 'YYYY-MM-DD'), 'Inglés;Alemán', 4)
  INTO PERFIL VALUES 
    ('Lucy', 'Potter', NULL, '+34123456705', 'Femenino', TO_DATE('1992-05-18', 'YYYY-MM-DD'), 'Inglés;Italiano', 5)
SELECT * FROM DUAL;

-- Añadir facturas para algunos usuarios existentes
INSERT ALL
  INTO FACTURA (id, fecha_emision, total, iva, subtotal, id_usuario) VALUES (1, TO_DATE('2025-08-01', 'YYYY-MM-DD'), 120.00, 21.00, 99.00, 2)
  INTO FACTURA VALUES (2, TO_DATE('2025-08-05', 'YYYY-MM-DD'), 45.50, 7.56, 37.94, 4)
  INTO FACTURA VALUES (3, TO_DATE('2025-08-10', 'YYYY-MM-DD'), 300.00, 63.00, 237.00, 6)
  INTO FACTURA VALUES (4, TO_DATE('2025-08-12', 'YYYY-MM-DD'), 80.00, 16.80, 63.20, 8)
  INTO FACTURA VALUES (5, TO_DATE('2025-08-15', 'YYYY-MM-DD'), 15.00, 3.15, 11.85, 10)
SELECT * FROM DUAL;

-- PAGO
INSERT INTO PAGO (fecha_pago, total, metodo_pago, estado, id_usuario, id_actividad, id_factura) 
    VALUES (TO_DATE('2025-08-02', 'YYYY-MM-DD'), 120.00, 'Tarjeta', 'Pagado', 2, 1, 1);
    
INSERT INTO PAGO (fecha_pago, total, metodo_pago, estado, id_usuario, id_actividad, id_factura) 
    VALUES (TO_DATE('2025-08-06', 'YYYY-MM-DD'), 45.50, 'Transferencia', 'Pagado', 4, 2, 2);
    
INSERT INTO PAGO (fecha_pago, total, metodo_pago, estado, id_usuario, id_actividad, id_factura) 
    VALUES (TO_DATE('2025-08-11', 'YYYY-MM-DD'), 300.00, 'Tarjeta', 'En proceso', 6, 3, 3);
    
INSERT INTO PAGO (fecha_pago, total, metodo_pago, estado, id_usuario, id_actividad, id_factura) 
    VALUES (TO_DATE('2025-08-13', 'YYYY-MM-DD'), 80.00, 'Efectivo', 'Pagado', 8, 4, 4);
    
INSERT INTO PAGO (fecha_pago, total, metodo_pago, estado, id_usuario, id_actividad, id_factura) 
    VALUES (TO_DATE('2025-08-16', 'YYYY-MM-DD'), 15.00, 'PayPal', 'No pagado', 10, 5, 5);

-- NOTIFICACION
INSERT INTO NOTIFICACION (titulo, descripcion, fecha, hora, leido, id_actividad, id_usuario_generador, id_pago) 
    VALUES ('Registro confirmado', 'Tu inscripción a la actividad ha sido confirmada.', TO_DATE('2025-08-02', 'YYYY-MM-DD'), TO_TIMESTAMP('09:30:00', 'HH24:MI:SS'), 1, 1, 2, 1);
INSERT INTO NOTIFICACION (titulo, descripcion, fecha, hora, leido, id_actividad, id_usuario_generador, id_pago) 
    VALUES ('Pago recibido', 'Hemos recibido tu pago correctamente. Gracias.', TO_DATE('2025-08-06', 'YYYY-MM-DD'), TO_TIMESTAMP('14:15:00', 'HH24:MI:SS'), 1, 2, 4, 2);
INSERT INTO NOTIFICACION (titulo, descripcion, fecha, hora, leido, id_actividad, id_usuario_generador, id_pago) 
    VALUES ('Pago en revisión', 'Tu pago está siendo revisado por el equipo de finanzas.', TO_DATE('2025-08-11', 'YYYY-MM-DD'), TO_TIMESTAMP('11:00:00', 'HH24:MI:SS'), 0, 3, 6, 3);
INSERT INTO NOTIFICACION (titulo, descripcion, fecha, hora, leido, id_actividad, id_usuario_generador, id_pago) 
    VALUES ('Recordatorio de actividad', 'La actividad comienza mañana a las 10:00. Llega 15 minutos antes.', TO_DATE('2025-08-11', 'YYYY-MM-DD'), TO_TIMESTAMP('18:00:00', 'HH24:MI:SS'), 0, 4, 8, NULL);
INSERT INTO NOTIFICACION (titulo, descripcion, fecha, hora, leido, id_actividad, id_usuario_generador, id_pago) 
    VALUES ('Pago pendiente', 'Tienes un pago pendiente que debes completar para asegurar tu plaza.', TO_DATE('2025-08-16', 'YYYY-MM-DD'), TO_TIMESTAMP('08:45:00', 'HH24:MI:SS'), 0, 5, 10, 5);
    
-- PERFIL_ACTIVIDAD
INSERT INTO PERFIL_ACTIVIDAD (id_perfil, id_actividad) VALUES (1, 1);
INSERT INTO PERFIL_ACTIVIDAD (id_perfil, id_actividad) VALUES (1, 2);
INSERT INTO PERFIL_ACTIVIDAD (id_perfil, id_actividad) VALUES (2, 2);
INSERT INTO PERFIL_ACTIVIDAD (id_perfil, id_actividad) VALUES (3, 3);
INSERT INTO PERFIL_ACTIVIDAD (id_perfil, id_actividad) VALUES (5, 5);

-- USUARIO_ACTIVIDAD
INSERT INTO USUARIO_ACTIVIDAD (id_usuario, id_actividad) VALUES (1, 1);
INSERT INTO USUARIO_ACTIVIDAD (id_usuario, id_actividad) VALUES (2, 1);
INSERT INTO USUARIO_ACTIVIDAD (id_usuario, id_actividad) VALUES (3, 3);
INSERT INTO USUARIO_ACTIVIDAD (id_usuario, id_actividad) VALUES (4, 2);
INSERT INTO USUARIO_ACTIVIDAD (id_usuario, id_actividad) VALUES (10, 5);

-- USUARIO_NOTIFICACION
INSERT INTO USUARIO_NOTIFICACION (id_usuario, id_notificacion) VALUES (2, 1);
INSERT INTO USUARIO_NOTIFICACION (id_usuario, id_notificacion) VALUES (4, 2);
INSERT INTO USUARIO_NOTIFICACION (id_usuario, id_notificacion) VALUES (6, 3);
INSERT INTO USUARIO_NOTIFICACION (id_usuario, id_notificacion) VALUES (8, 4);
INSERT INTO USUARIO_NOTIFICACION (id_usuario, id_notificacion) VALUES (10, 5);