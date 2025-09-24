-- 1) Roles
INSERT INTO
    roles (nombre, descripcion)
VALUES (
        'Cliente',
        'Usuario que compra entradas'
    ),
    (
        'Empleado',
        'Gestión de funciones y ventas'
    ),
    (
        'Administrador',
        'Gestión completa del sistema'
    );

-- 2) Usuario administrador
INSERT INTO
    usuarios (
        email,
        password_hash,
        nombre,
        apellido,
        telefono,
        genero,
        rol_id,
        activo,
        email_verificado
    )
VALUES (
        'admin@cineestelar.com',
        crypt ('admin123', gen_salt ('bf')),
        'Administrador',
        'Sistema',
        '+51987654321',
        'M',
        3,
        true,
        true
    );

-- 3) Géneros
INSERT INTO
    generos (nombre, descripcion)
VALUES (
        'Acción',
        'Películas de acción y aventura'
    ),
    (
        'Comedia',
        'Películas cómicas y de humor'
    ),
    (
        'Drama',
        'Películas dramáticas'
    ),
    (
        'Terror',
        'Películas de terror y suspenso'
    ),
    (
        'Ciencia Ficción',
        'Películas de ciencia ficción y fantasía'
    );

-- 4) Salas
INSERT INTO
    salas (
        nombre,
        capacidad,
        tipo,
        activa
    )
VALUES (
        'Sala 1',
        120,
        'Estándar',
        true
    ),
    ('Sala 2', 80, 'VIP', true),
    ('Sala 3', 150, '3D', true),
    (
        'Sala 4',
        100,
        'Estándar',
        true
    ),
    ('Sala 5', 200, 'IMAX', true);

-- 5) Filas
INSERT INTO
    filas (
        sala_id,
        letra,
        numero_fila,
        tipo_fila,
        cantidad_asientos,
        precio_multiplicador
    )
VALUES (1, 'A', 1, 'Normal', 12, 1.00),
    (1, 'B', 2, 'Normal', 12, 1.00),
    (1, 'C', 3, 'Normal', 12, 1.00),
    (1, 'D', 4, 'Normal', 12, 1.00),
    (
        1,
        'E',
        5,
        'Premium',
        12,
        1.20
    ),
    (2, 'A', 1, 'VIP', 8, 1.50),
    (2, 'B', 2, 'VIP', 8, 1.50),
    (2, 'C', 3, 'VIP', 8, 1.50),
    (2, 'D', 4, 'VIP', 8, 1.50),
    (2, 'E', 5, 'VIP', 8, 1.50);

-- 6) Asientos
INSERT INTO
    asientos (fila_id, numero, tipo, activo)
SELECT
    f.id,
    generate_series (1, f.cantidad_asientos),
    CASE
        WHEN f.tipo_fila = 'VIP' THEN 'VIP'
        ELSE 'Normal'
    END,
    true
FROM filas f
WHERE
    f.sala_id = 1;

INSERT INTO
    asientos (fila_id, numero, tipo, activo)
SELECT f.id, generate_series (1, f.cantidad_asientos), 'VIP', true
FROM filas f
WHERE
    f.sala_id = 2;

-- 7) Películas
INSERT INTO
    peliculas (
        titulo,
        titulo_original,
        sinopsis,
        duracion,
        clasificacion,
        idioma_original,
        director,
        reparto,
        poster_url,
        trailer_url,
        fecha_estreno,
        activa,
        destacada,
        calificacion
    )
VALUES (
        'Avatar: El Camino del Agua',
        'Avatar: The Way of Water',
        'Jake Sully vive con su nueva familia formada en el planeta de Pandora...',
        192,
        'PG-13',
        'Inglés',
        'James Cameron',
        'Sam Worthington, Zoe Saldana, Sigourney Weaver',
        'https://example.com/avatar2.jpg',
        'https://example.com/avatar2_trailer.mp4',
        '2024-01-15',
        true,
        true,
        8.5
    ),
    (
        'Top Gun: Maverick',
        'Top Gun: Maverick',
        'Después de más de 30 años de servicio...',
        130,
        'PG-13',
        'Inglés',
        'Joseph Kosinski',
        'Tom Cruise, Miles Teller, Jennifer Connelly',
        'https://example.com/topgun.jpg',
        'https://example.com/topgun_trailer.mp4',
        '2024-01-20',
        true,
        true,
        9.0
    ),
    (
        'Black Panther: Wakanda Forever',
        'Black Panther: Wakanda Forever',
        'La reina Ramonda, Shuri, MBaku...',
        161,
        'PG-13',
        'Inglés',
        'Ryan Coogler',
        'Letitia Wright, Angela Bassett, Tenoch Huerta',
        'https://example.com/blackpanther2.jpg',
        'https://example.com/blackpanther2_trailer.mp4',
        '2024-01-25',
        true,
        false,
        7.8
    ),
    (
        'Scream VI',
        'Scream VI',
        'Los hermanos Carpenter se mudan a Nueva York...',
        123,
        'R',
        'Inglés',
        'Matt Bettinelli-Olpin',
        'Melissa Barrera, Jenna Ortega, Jasmin Savoy Brown',
        'https://example.com/scream6.jpg',
        'https://example.com/scream6_trailer.mp4',
        '2024-02-01',
        true,
        false,
        7.2
    ),
    (
        'Ant-Man and the Wasp: Quantumania',
        'Ant-Man and the Wasp: Quantumania',
        'Scott Lang y Hope Van Dyne exploran el Reino Cuántico...',
        124,
        'PG-13',
        'Inglés',
        'Peyton Reed',
        'Paul Rudd, Evangeline Lilly, Michael Douglas',
        'https://example.com/antman3.jpg',
        'https://example.com/antman3_trailer.mp4',
        '2024-02-05',
        true,
        true,
        7.5
    );

-- 8) Película - Géneros
INSERT INTO
    pelicula_generos (pelicula_id, genero_id)
VALUES (
        (
            SELECT id
            FROM peliculas
            WHERE
                titulo = 'Avatar: El Camino del Agua'
        ),
        1
    ),
    (
        (
            SELECT id
            FROM peliculas
            WHERE
                titulo = 'Avatar: El Camino del Agua'
        ),
        5
    ),
    (
        (
            SELECT id
            FROM peliculas
            WHERE
                titulo = 'Top Gun: Maverick'
        ),
        1
    ),
    (
        (
            SELECT id
            FROM peliculas
            WHERE
                titulo = 'Black Panther: Wakanda Forever'
        ),
        1
    ),
    (
        (
            SELECT id
            FROM peliculas
            WHERE
                titulo = 'Black Panther: Wakanda Forever'
        ),
        3
    ),
    (
        (
            SELECT id
            FROM peliculas
            WHERE
                titulo = 'Scream VI'
        ),
        4
    ),
    (
        (
            SELECT id
            FROM peliculas
            WHERE
                titulo = 'Ant-Man and the Wasp: Quantumania'
        ),
        1
    ),
    (
        (
            SELECT id
            FROM peliculas
            WHERE
                titulo = 'Ant-Man and the Wasp: Quantumania'
        ),
        5
    );

-- 9) Funciones
INSERT INTO
    funciones (
        pelicula_id,
        sala_id,
        fecha_hora,
        precio_base,
        precio_vip,
        subtitulada,
        formato,
        activa,
        asientos_disponibles
    )
VALUES (
        (
            SELECT id
            FROM peliculas
            WHERE
                titulo = 'Avatar: El Camino del Agua'
        ),
        1,
        '2024-02-15 14:00:00',
        15.00,
        25.00,
        false,
        '3D',
        true,
        120
    ),
    (
        (
            SELECT id
            FROM peliculas
            WHERE
                titulo = 'Avatar: El Camino del Agua'
        ),
        3,
        '2024-02-15 17:30:00',
        18.00,
        28.00,
        true,
        '3D',
        true,
        150
    ),
    (
        (
            SELECT id
            FROM peliculas
            WHERE
                titulo = 'Avatar: El Camino del Agua'
        ),
        5,
        '2024-02-15 20:00:00',
        22.00,
        35.00,
        false,
        'IMAX',
        true,
        200
    ),
    (
        (
            SELECT id
            FROM peliculas
            WHERE
                titulo = 'Top Gun: Maverick'
        ),
        2,
        '2024-02-15 15:00:00',
        20.00,
        30.00,
        false,
        '2D',
        true,
        80
    ),
    (
        (
            SELECT id
            FROM peliculas
            WHERE
                titulo = 'Top Gun: Maverick'
        ),
        4,
        '2024-02-15 19:00:00',
        15.00,
        25.00,
        true,
        '2D',
        true,
        100
    ),
    (
        (
            SELECT id
            FROM peliculas
            WHERE
                titulo = 'Black Panther: Wakanda Forever'
        ),
        1,
        '2024-02-16 16:00:00',
        15.00,
        25.00,
        false,
        '2D',
        true,
        120
    ),
    (
        (
            SELECT id
            FROM peliculas
            WHERE
                titulo = 'Black Panther: Wakanda Forever'
        ),
        3,
        '2024-02-16 21:00:00',
        18.00,
        28.00,
        true,
        '3D',
        true,
        150
    ),
    (
        (
            SELECT id
            FROM peliculas
            WHERE
                titulo = 'Scream VI'
        ),
        4,
        '2024-02-16 22:00:00',
        15.00,
        25.00,
        true,
        '2D',
        true,
        100
    ),
    (
        (
            SELECT id
            FROM peliculas
            WHERE
                titulo = 'Ant-Man and the Wasp: Quantumania'
        ),
        2,
        '2024-02-17 14:30:00',
        20.00,
        30.00,
        false,
        '2D',
        true,
        80
    ),
    (
        (
            SELECT id
            FROM peliculas
            WHERE
                titulo = 'Ant-Man and the Wasp: Quantumania'
        ),
        5,
        '2024-02-17 18:00:00',
        22.00,
        35.00,
        true,
        'IMAX',
        true,
        200
    );

-- 10) Usuarios clientes
INSERT INTO
    usuarios (
        email,
        password_hash,
        nombre,
        apellido,
        telefono,
        fecha_nacimiento,
        genero,
        rol_id,
        activo,
        email_verificado
    )
VALUES (
        'juan.perez@email.com',
        crypt (
            'password123',
            gen_salt ('bf')
        ),
        'Juan',
        'Pérez',
        '+51987654322',
        '1990-05-15',
        'M',
        1,
        true,
        true
    ),
    (
        'maria.garcia@email.com',
        crypt (
            'password123',
            gen_salt ('bf')
        ),
        'María',
        'García',
        '+51987654323',
        '1985-08-22',
        'F',
        1,
        true,
        true
    ),
    (
        'carlos.rodriguez@email.com',
        crypt (
            'password123',
            gen_salt ('bf')
        ),
        'Carlos',
        'Rodríguez',
        '+51987654324',
        '1992-12-10',
        'M',
        1,
        true,
        false
    ),
    (
        'ana.martinez@email.com',
        crypt (
            'password123',
            gen_salt ('bf')
        ),
        'Ana',
        'Martínez',
        '+51987654325',
        '1988-03-07',
        'F',
        1,
        true,
        true
    ),
    (
        'empleado@cineestelar.com',
        crypt (
            'empleado123',
            gen_salt ('bf')
        ),
        'Pedro',
        'Empleado',
        '+51987654326',
        '1987-11-20',
        'M',
        2,
        true,
        true
    );

-- 11) Promociones
INSERT INTO
    promociones (
        titulo,
        descripcion,
        tipo,
        valor,
        codigo,
        fecha_inicio,
        fecha_fin,
        usos_maximos,
        activa,
        condiciones
    )
VALUES (
        'Descuento Estudiante',
        '20% de descuento para estudiantes',
        'descuento_porcentaje',
        20.00,
        'ESTUDIANTE20',
        '2024-02-01 00:00:00',
        '2024-12-31 23:59:59',
        1000,
        true,
        '{"requiere_carnet": true}'
    ),
    (
        '2x1 Martes',
        'Dos entradas por el precio de una los martes',
        '2x1',
        0.00,
        'MARTES2X1',
        '2024-02-01 00:00:00',
        '2024-12-31 23:59:59',
        null,
        true,
        '{"dia_semana": "martes"}'
    ),
    (
        'Descuento Tercera Edad',
        '30% de descuento para mayores de 65 años',
        'descuento_porcentaje',
        30.00,
        'SENIOR30',
        '2024-02-01 00:00:00',
        '2024-12-31 23:59:59',
        null,
        true,
        '{"edad_minima": 65}'
    ),
    (
        'Combo Familiar',
        'S/10 de descuento en compras familiares',
        'descuento_fijo',
        10.00,
        'FAMILIA10',
        '2024-02-01 00:00:00',
        '2024-06-30 23:59:59',
        500,
        true,
        '{"minimo_entradas": 4}'
    ),
    (
        'Estreno VIP',
        '15% de descuento en funciones VIP de estrenos',
        'descuento_porcentaje',
        15.00,
        'VIPESTRENO',
        '2024-02-01 00:00:00',
        '2024-03-31 23:59:59',
        200,
        true,
        '{"solo_estrenos": true, "solo_vip": true}'
    );