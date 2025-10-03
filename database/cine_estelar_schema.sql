CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT,
    permisos JSONB DEFAULT '{}',
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    fecha_nacimiento DATE,
    genero VARCHAR(10) CHECK (genero IN ('M', 'F', 'Otro')),
    rol_id INTEGER REFERENCES roles (id) DEFAULT 1,
    activo BOOLEAN DEFAULT true,
    email_verificado BOOLEAN DEFAULT false,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultima_conexion TIMESTAMP,
    push_token VARCHAR(500),
    preferencias JSONB DEFAULT '{}'
);

CREATE TABLE generos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT,
    activo BOOLEAN DEFAULT true
);

CREATE TABLE peliculas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    titulo VARCHAR(255) NOT NULL,
    titulo_original VARCHAR(255),
    sinopsis TEXT,
    duracion INTEGER NOT NULL, -- en minutos
    clasificacion VARCHAR(10) NOT NULL, -- G, PG, PG-13, R, etc.
    idioma_original VARCHAR(50),
    subtitulos VARCHAR(100),
    director VARCHAR(255),
    reparto TEXT,
    poster_url VARCHAR(500),
    trailer_url VARCHAR(500),
    fecha_estreno DATE,
    fecha_fin_exhibicion DATE,
    activa BOOLEAN DEFAULT true,
    destacada BOOLEAN DEFAULT false,
    calificacion DECIMAL(3, 1), -- 0.0 a 10.0
    votos INTEGER DEFAULT 0,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pelicula_generos (
    pelicula_id UUID REFERENCES peliculas (id) ON DELETE CASCADE,
    genero_id INTEGER REFERENCES generos (id) ON DELETE CASCADE,
    PRIMARY KEY (pelicula_id, genero_id)
);

CREATE TABLE cines (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    direccion TEXT NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(100),
    latitud DECIMAL(10, 8),
    longitud DECIMAL(11, 8),
    horario_apertura TIME,
    horario_cierre TIME,
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    imagen_url VARCHAR(500),
    descripcion TEXT
);

CREATE TABLE salas (
    id SERIAL PRIMARY KEY,
    cine_id INTEGER REFERENCES cines (id) ON DELETE CASCADE,
    nombre VARCHAR(50) NOT NULL,
    capacidad INTEGER NOT NULL,
    tipo VARCHAR(50) DEFAULT 'Estándar', -- Estándar, VIP, 3D, IMAX
    activa BOOLEAN DEFAULT true,
    configuracion_general JSONB -- Configuración general de la sala
);

CREATE TABLE filas (
    id SERIAL PRIMARY KEY,
    sala_id INTEGER REFERENCES salas (id) ON DELETE CASCADE,
    letra VARCHAR(2) NOT NULL, -- A, B, C, etc.
    numero_fila INTEGER NOT NULL, -- 1, 2, 3, etc. para ordenamiento
    tipo_fila VARCHAR(20) DEFAULT 'Normal', -- Normal, VIP, Premium
    cantidad_asientos INTEGER NOT NULL,
    precio_multiplicador DECIMAL(3, 2) DEFAULT 1.00, -- Multiplicador de precio para esta fila
    activa BOOLEAN DEFAULT true,
    UNIQUE (sala_id, letra),
    UNIQUE (sala_id, numero_fila)
);

CREATE TABLE asientos (
    id SERIAL PRIMARY KEY,
    fila_id INTEGER REFERENCES filas (id) ON DELETE CASCADE,
    numero INTEGER NOT NULL,
    tipo VARCHAR(20) DEFAULT 'Normal', -- Normal, VIP, Discapacitado, Pareja
    activo BOOLEAN DEFAULT true,
    observaciones TEXT,
    UNIQUE (fila_id, numero)
);

CREATE TABLE funciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    pelicula_id UUID REFERENCES peliculas (id) ON DELETE CASCADE,
    sala_id INTEGER REFERENCES salas (id) ON DELETE CASCADE,
    fecha_hora TIMESTAMP NOT NULL,
    precio_base DECIMAL(8, 2) NOT NULL,
    precio_vip DECIMAL(8, 2),
    subtitulada BOOLEAN DEFAULT false,
    doblada BOOLEAN DEFAULT false,
    formato VARCHAR(20) DEFAULT '2D', -- 2D, 3D, IMAX
    activa BOOLEAN DEFAULT true,
    asientos_disponibles INTEGER,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reservas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    usuario_id UUID REFERENCES usuarios (id) ON DELETE CASCADE,
    funcion_id UUID REFERENCES funciones (id) ON DELETE CASCADE,
    codigo_reserva VARCHAR(20) UNIQUE NOT NULL,
    estado VARCHAR(20) DEFAULT 'pendiente', -- pendiente, confirmada, cancelada, expirada
    total DECIMAL(8, 2) NOT NULL,
    fecha_reserva TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_expiracion TIMESTAMP, -- Reservas expiran en 15 minutos
    metodo_pago VARCHAR(50), -- tarjeta, yape, plin, efectivo
    transaccion_id VARCHAR(100),
    notas TEXT
);

CREATE TABLE entradas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    reserva_id UUID REFERENCES reservas (id) ON DELETE CASCADE,
    asiento_id INTEGER REFERENCES asientos (id) ON DELETE CASCADE,
    precio DECIMAL(8, 2) NOT NULL,
    codigo_qr VARCHAR(255) UNIQUE,
    usado BOOLEAN DEFAULT false,
    fecha_uso TIMESTAMP,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pagos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    reserva_id UUID REFERENCES reservas (id) ON DELETE CASCADE,
    monto DECIMAL(8, 2) NOT NULL,
    metodo VARCHAR(50) NOT NULL, -- visa, mastercard, yape, plin, efectivo
    estado VARCHAR(20) DEFAULT 'pendiente', -- pendiente, completado, fallido, reembolsado
    transaccion_externa_id VARCHAR(255),
    fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    datos_pago JSONB, -- Información adicional del pago
    comprobante_url VARCHAR(500)
);