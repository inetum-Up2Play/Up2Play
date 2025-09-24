
-- Tabla USUARIO
CREATE TABLE USUARIO (
    id INT PRIMARY KEY IDENTITY(1,1),
    email VARCHAR(255) NOT NULL UNIQUE,
    contraseña VARCHAR(255) NOT NULL,
    rol VARCHAR(50) NOT NULL,
    nombre_usuario VARCHAR(25) NOT NULL UNIQUE
);

-- Tabla PERFIL
CREATE TABLE PERFIL (
    id INT PRIMARY KEY IDENTITY(1,1),
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    fotografia VARBINARY(MAX),
    telefono VARCHAR(20),
    sexo VARCHAR(10) CHECK (sexo IN('Masculino', 'Femenino', 'Otro')),
    fecha_nac DATE,
    idiomas VARCHAR(255),
    id_usuario INT NOT NULL UNIQUE,
    FOREIGN KEY (id_usuario) REFERENCES USUARIO(id)
);

-- Tabla ACTIVIDAD
CREATE TABLE ACTIVIDAD (
    id INT PRIMARY KEY IDENTITY(1,1),
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(MAX),
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    ubicacion VARCHAR(255),
    nivel VARCHAR(50) CHECK (nivel IN('Iniciado', 'Principiante', 'Intermedio', 'Avanzado', 'Experto')),
    num_pers_inscritas INT DEFAULT 1,
    num_pers_totales INT,
    estado VARCHAR(50) CHECK (estado IN('Completada', 'En curso', 'Pendiente', 'Cancelada')),
    precio DECIMAL(10,2),
    id_usuario_creador INT NOT NULL,
    FOREIGN KEY (id_usuario_creador) REFERENCES USUARIO(id)
);

-- Tabla FACTURA
CREATE TABLE FACTURA (
    id INT PRIMARY KEY IDENTITY(1,1),
    fecha_emision DATE NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    iva DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    id_usuario INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES USUARIO(id)
);

-- Tabla PAGO
CREATE TABLE PAGO (
    id INT PRIMARY KEY IDENTITY(1,1),
    fecha_pago DATE NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    metodo_pago VARCHAR(50) NOT NULL,
    estado VARCHAR(50) CHECK (estado IN('Pagado', 'No pagado', 'En proceso', 'Cancelado')),
    id_usuario INT NOT NULL,
    id_actividad INT NOT NULL,
    id_factura INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES USUARIO(id),
    FOREIGN KEY (id_actividad) REFERENCES ACTIVIDAD(id),
    FOREIGN KEY (id_factura) REFERENCES FACTURA(id)
);

-- Tabla NOTIFICACION
CREATE TABLE NOTIFICACION (
    id INT PRIMARY KEY IDENTITY(1,1),
    titulo VARCHAR(255) NOT NULL,
    descripcion VARCHAR(MAX),
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    leido BIT, -- '0' (interpretado como FALSE) '1' (cinterpretado como TRUE) NULL (si está permitido, representa un valor indeterminado)
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
