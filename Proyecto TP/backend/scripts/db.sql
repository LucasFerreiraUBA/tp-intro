create table arma_rutina (
    id serial primary key,
    ejercicio varchar(30) NOT NULL,
    repeticiones int NOT NULL,
    peso int NOT NULL,
    grupo_muscular_id int NOT NULL REFERENCES grupo_muscular(id), 
    rir int,
    tiempo_descanso int,
    descripcion varchar(100)
);

create table grupo_muscular (
    id serial primary key,
    nombre varchar(30) NOT NULL
);

INSERT INTO arma_rutina (
    ejercicio, repeticiones, peso, grupo_muscular_id, rir, tiempo_descanso, descripcion
) VALUES
('Banco Plano', 7, 100, 1, 1, 60, 'Ejercicio de pecho para fuerza'),
('Press Inclinado con mancuernas', 10, 80, 1, 2, 60, NULL),
('Aperturas con mancuernas', 12, 20, 1, 2, 45, 'Aislamiento de pectorales'),
('Remo con barra', 8, 90, 2, 1, 60, 'Ejercicio compuesto para espalda media'),
('Jalón al pecho', 10, 70, 2, NULL, 60, 'Enfocado en dorsal ancho'),
('Peso muerto', 5, 120, 2, 1, 90, 'Ejercicio completo para fuerza posterior'),
('Sentadillas', 6, 110, 3, 1, 90, 'Ejercicio base para tren inferior'),
('Prensa de piernas', 12, 200, 3, 2, 60, 'Desarrollo de cuádriceps y glúteos'),
('Curl femoral', 10, 50, 3, 2, 45, 'Enfocado en isquiotibiales'),
('Curl de bíceps con barra', 10, 30, 4, 2, NULL, 'Hipertrofia de bíceps'),
('Tríceps en polea', 12, 40, 5, 2, 45, 'Trabajo de tríceps con cuerda');

INSERT INTO grupo_muscular (
    nombre
) VALUES 
('Pecho'),
('Espalda'),
('Piernas'),
('Bíceps'),
('Tríceps'),
('Hombros'),
('Abdominales'),
('Glúteos'),
('Isquiotibiales'),
('Cuádriceps'),
('Gemelos'),
('Trapecio'),
('Antebrazos'),
('Deltoides'),
('Aductores');

  
