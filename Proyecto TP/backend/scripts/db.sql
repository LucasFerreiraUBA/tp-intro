create table grupo_muscular (
    id serial primary key,
    nombre varchar(30) NOT NULL
);

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

create table alimentacion (
    id serial primary key,
    nombre_comida varchar(50) NOT NULL,
    tipo_comida varchar(20) NOT NULL, 
    calorias int NOT NULL,
    proteinas int NOT NULL,
    carbohidratos int NOT NULL,
    grasas int NOT NULL,
    rutina_id int REFERENCES arma_rutina(id), 
    descripcion varchar(100)
);

create table entrenamiento (
    id serial primary key,
    dia_semana varchar(15) NOT NULL,
    objetivo varchar(50) NOT NULL,
    nivel_usuario varchar(20),
    duracion_minutos int,
    descripcion varchar(100)
);

create table entrenamiento_ejercicio (
    id serial primary key,
    entrenamiento_id int REFERENCES entrenamiento(id),
    rutina_id int REFERENCES arma_rutina(id)
);

create table entrenamiento_alimentacion (
    id serial primary key,
    entrenamiento_id int REFERENCES entrenamiento(id),
    alimentacion_id int REFERENCES alimentacion(id)
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

INSERT INTO alimentacion (
    nombre_comida, tipo_comida, calorias, proteinas, carbohidratos, grasas, rutina_id, descripcion
) VALUES
('Pechuga con arroz', 'almuerzo', 600, 45, 50, 10, 1, 'Post-entreno después de Banco Plano'),
('Batido de proteínas', 'merienda', 250, 30, 10, 5, 2, 'Ideal después del Press Inclinado'),
('Tortilla de claras', 'desayuno', 300, 25, 20, 8, 4, 'Antes del Remo con barra'),
('Salmón con ensalada', 'cena', 500, 35, 15, 20, 6, 'Recuperación después del Peso muerto'),
('Yogur con avena', 'desayuno', 350, 15, 40, 7, 10, 'Antes de entrenar bíceps'),
('Omelette de claras con avena', 'desayuno', 400, 30, 35, 10, 1, 'Desayuno pre entreno para fuerza en pecho'),
('Pechuga de pollo con papas', 'almuerzo', 650, 50, 60, 15, 1, 'Recuperación post Banco Plano'),
('Arroz integral con atún', 'almuerzo', 550, 40, 45, 8, 2, 'Alta proteína para entrenamiento de pecho'),
('Tostadas con mantequilla de maní', 'merienda', 300, 12, 25, 18, 2, 'Energía rápida pre entreno'),
('Sándwich de pollo y palta', 'almuerzo', 600, 35, 40, 20, 4, 'Perfecto para recuperación de espalda'),
('Yogur griego con nueces', 'desayuno', 400, 20, 25, 18, 4, 'Desayuno balanceado antes de entrenar');


INSERT INTO entrenamiento (dia_semana, objetivo, nivel_usuario, duracion_minutos, descripcion) VALUES
('Lunes', 'Hipertrofia tren superior', 'Intermedio', 70, 'Pecho, tríceps y hombros'),
('Martes', 'Cardio y core', 'Principiante', 45, 'Entrenamiento aeróbico y abdominales'),
('Miércoles', 'Fuerza tren inferior', 'Avanzado', 80, 'Piernas y core'),
('Jueves', 'Espalda y bíceps', 'Intermedio', 65, 'Tirón y brazos'),
('Viernes', 'Fullbody', 'Principiante', 60, 'Circuito de cuerpo completo'),
('Sábado', 'Alta intensidad HIIT', 'Avanzado', 40, 'Interválico con ejercicios compuestos'),
('Domingo', 'Recuperación activa', 'Todos', 30, 'Movilidad, estiramientos y core');

INSERT INTO entrenamiento_ejercicio (entrenamiento_id, rutina_id) VALUES
(1, 1), 
(1, 5), 
(1, 7), 
(2, 6), 
(2, 4), 
(2, 7), 
(3, 2), 
(3, 3), 
(3, 6), 
(4, 2), 
(4, 4), 
(4, 7), 
(5, 1), 
(5, 3), 
(5, 4), 
(5, 6), 
(6, 3), 
(6, 5), 
(6, 6), 
(7, 6); 

INSERT INTO entrenamiento_alimentacion (entrenamiento_id, alimentacion_id) VALUES
(1, 2), 
(1, 4), 
(2, 6), 
(2, 1), 
(3, 1), 
(3, 5), 
(4, 2), 
(4, 3), 
(5, 3), 
(5, 6), 
(6, 1), 
(6, 5), 
(7, 4); 




  
