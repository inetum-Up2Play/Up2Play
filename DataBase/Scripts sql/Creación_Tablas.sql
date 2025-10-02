-- Tabla USUARIO
CREATE TABLE USUARIO (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email VARCHAR2(255) NOT NULL UNIQUE,
    contraseña VARCHAR2(255) NOT NULL,
    rol VARCHAR2(50) NOT NULL,
    nombre_usuario VARCHAR2(25) NOT NULL UNIQUE
);

-- Tabla PERFIL
CREATE TABLE PERFIL (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR2(50) NOT NULL,
    apellido VARCHAR2(100) NOT NULL,
    fotografia BLOB,
    telefono VARCHAR2(20),
    sexo VARCHAR2(10) CHECK (sexo IN('Masculino', 'Femenino', 'Otro')),
    fecha_nac DATE,
    idiomas VARCHAR2(255),
    id_usuario INT NOT NULL UNIQUE,
    FOREIGN KEY (id_usuario) REFERENCES USUARIO(id)
);

-- Tabla ACTIVIDAD
CREATE TABLE ACTIVIDAD (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR2(100) NOT NULL,
    descripcion CLOB,
    fecha DATE NOT NULL,
    hora TIMESTAMP NOT NULL,
    ubicacion VARCHAR2(255),
    nivel VARCHAR2(50) CHECK (nivel IN('Iniciado', 'Principiante', 'Intermedio', 'Avanzado', 'Experto')),
    num_pers_inscritas INT DEFAULT 1,
    num_pers_totales INT,
    estado VARCHAR2(50) CHECK (estado IN('Completada', 'En curso', 'Pendiente', 'Cancelada')),
    precio NUMBER(10,2),
    id_usuario_creador INT NOT NULL,
    FOREIGN KEY (id_usuario_creador) REFERENCES USUARIO(id)
);

-- Tabla FACTURA
CREATE TABLE FACTURA (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    fecha_emision DATE NOT NULL,
    total NUMBER(10,2) NOT NULL,
    iva NUMBER(10,2) NOT NULL,
    subtotal NUMBER(10,2) NOT NULL,
    id_usuario INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES USUARIO(id)
);

-- Tabla PAGO
CREATE TABLE PAGO (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    fecha_pago DATE NOT NULL,
    total NUMBER(10,2) NOT NULL,
    metodo_pago VARCHAR2(50) NOT NULL,
    estado VARCHAR2(50) CHECK (estado IN('Pagado', 'No pagado', 'En proceso', 'Cancelado')),
    id_usuario INT NOT NULL,
    id_actividad INT NOT NULL,
    id_factura INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES USUARIO(id),
    FOREIGN KEY (id_actividad) REFERENCES ACTIVIDAD(id),
    FOREIGN KEY (id_factura) REFERENCES FACTURA(id)
);

-- Tabla NOTIFICACION
CREATE TABLE NOTIFICACION (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    titulo VARCHAR2(255) NOT NULL,
    descripcion CLOB,
    fecha DATE NOT NULL,
    hora TIMESTAMP NOT NULL,
    leido NUMBER(1) CHECK (leido IN (0, 1)), -- '0' (interpretado como FALSE) '1' (interpretado como TRUE)
    id_actividad INT NOT NULL,
    id_usuario_generador INT NOT NULL,
    id_pago INT,
    FOREIGN KEY (id_actividad) REFERENCES ACTIVIDAD(id),
    FOREIGN KEY (id_usuario_generador) REFERENCES USUARIO(id),
    FOREIGN KEY (id_pago) REFERENCES PAGO(id)
);

-- Tabla PERFIL_ACTIVIDAD (Historial de actividades)
CREATE TABLE PERFIL_ACTIVIDAD (
    id_perfil INT NOT NULL,
    id_actividad INT NOT NULL,
    PRIMARY KEY (id_perfil, id_actividad),
    FOREIGN KEY (id_perfil) REFERENCES PERFIL(id),
    FOREIGN KEY (id_actividad) REFERENCES ACTIVIDAD(id)
);

-- Tabla USUARIO_ACTIVIDAD (Participantes de actividad)
CREATE TABLE USUARIO_ACTIVIDAD (
    id_usuario INT NOT NULL,
    id_actividad INT NOT NULL,
    PRIMARY KEY (id_usuario, id_actividad),
    FOREIGN KEY (id_usuario) REFERENCES USUARIO(id),
    FOREIGN KEY (id_actividad) REFERENCES ACTIVIDAD(id)
);

-- Tabla USUARIO_NOTIFICACION (Notificación recibida)
CREATE TABLE USUARIO_NOTIFICACION (
    id_usuario INT NOT NULL,
    id_notificacion INT NOT NULL,
    PRIMARY KEY (id_usuario, id_notificacion),
    FOREIGN KEY (id_usuario) REFERENCES USUARIO(id),
    FOREIGN KEY (id_notificacion) REFERENCES NOTIFICACION(id)
);