DROP TABLE IF EXISTS entrenamiento_alimentacion;
DROP TABLE IF EXISTS entrenamiento_ejercicio;
DROP TABLE IF EXISTS entrenamiento;
DROP TABLE IF EXISTS alimentacion;
DROP TABLE IF EXISTS arma_rutina;
DROP TABLE IF EXISTS grupo_muscular;


CREATE TABLE grupo_muscular (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(30) NOT NULL
);

CREATE TABLE arma_rutina (
    id SERIAL PRIMARY KEY,
    ejercicio VARCHAR(30) NOT NULL,
    repeticiones INT NOT NULL,
    peso INT,
    grupo_muscular_id INT NOT NULL REFERENCES grupo_muscular(id) ON DELETE CASCADE,
    rir INT,
    tiempo_descanso INT,
    descripcion VARCHAR(100)
);

CREATE TABLE alimentacion (
    id SERIAL PRIMARY KEY,
    nombre_comida VARCHAR(50) NOT NULL,
    tipo_comida VARCHAR(20) NOT NULL, 
    calorias INT NOT NULL,
    proteinas INT NOT NULL,
    carbohidratos INT NOT NULL,
    grasas INT NOT NULL,
    rutina_id INT REFERENCES arma_rutina(id) ON DELETE SET NULL,
    descripcion VARCHAR(100)
);

CREATE TABLE entrenamiento (
    id SERIAL PRIMARY KEY,
    dia_semana VARCHAR(15) NOT NULL,
    objetivo VARCHAR(50) NOT NULL,
    nivel_usuario VARCHAR(20),
    duracion_minutos INT,
    descripcion VARCHAR(100)
);

CREATE TABLE entrenamiento_ejercicio (
    id SERIAL PRIMARY KEY,
    entrenamiento_id INT REFERENCES entrenamiento(id) ON DELETE CASCADE,
    rutina_id INT REFERENCES arma_rutina(id) ON DELETE CASCADE
);

CREATE TABLE entrenamiento_alimentacion (
    id SERIAL PRIMARY KEY,
    entrenamiento_id INT REFERENCES entrenamiento(id) ON DELETE CASCADE,
    alimentacion_id INT REFERENCES alimentacion(id) ON DELETE CASCADE
);

INSERT INTO grupo_muscular (nombre) VALUES 
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
('Tríceps en polea', 12, 40, 5, 2, 45, 'Trabajo de tríceps con cuerda'),
('Vuelos laterales', 12, 10, 6, 0, 2, 'Ejercicio para hombros'),
('Elevaciones de pierna', 12, NULL, 7, 1, 2, 'Ejercicio para el abdomen'),
('Burpees', 20, NULL, 7, 0, 2, 'Ejercicio aerobico de alta intensidad'),
('Saltos en soga', 20, NULL, 7, 0, 3, 'Ejercicio aerobico para el abdomen'),
('Flexiones de brazo', 20, NULL, 1, 2, 3, 'Ejercicio de peso corporal para pecho');

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
(1, 1), (1, 12), (1, 11),
(2, 14), (2, 15), (2, 13),
(3, 7), (3, 8), (3, 9),
(4, 4), (4, 5), (4, 10),
(5, 1), (5, 3), (5, 4), (5, 6),
(6, 7), (6, 14), (6, 16),
(7, 13);

INSERT INTO entrenamiento_alimentacion (entrenamiento_id, alimentacion_id) VALUES
(1, 2), (1, 4),
(2, 6), (2, 1),
(3, 1), (3, 5),
(4, 2), (4, 3),
(5, 3), (5, 6),
(6, 1), (6, 5),
(7, 4);

ALTER TABLE arma_rutina ADD COLUMN series INTEGER;

UPDATE arma_rutina SET series = 4 WHERE id = 1;  
UPDATE arma_rutina SET series = 3 WHERE id = 5;  
UPDATE arma_rutina SET series = 5 WHERE id = 7;
UPDATE arma_rutina SET series = 4 WHERE id = 2; 
UPDATE arma_rutina SET series = 3 WHERE id = 3; 
UPDATE arma_rutina SET series = 4 WHERE id = 4; 
UPDATE arma_rutina SET series = 3 WHERE id = 6; 
UPDATE arma_rutina SET series = 5 WHERE id = 8; 
UPDATE arma_rutina SET series = 4 WHERE id = 9; 
UPDATE arma_rutina SET series = 3 WHERE id = 10; 
UPDATE arma_rutina SET series = 3 WHERE id = 11; 
UPDATE arma_rutina SET series = 4 WHERE id = 12; 
UPDATE arma_rutina SET series = 3 WHERE id = 13; 
UPDATE arma_rutina SET series = 3 WHERE id = 14; 
UPDATE arma_rutina SET series = 4 WHERE id = 15; 
UPDATE arma_rutina SET series = 3 WHERE id = 16;
