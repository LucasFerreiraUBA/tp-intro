const { Pool } = require("pg");

const dbClient = new Pool({
  user: "postgres",
  port: 5432,
  host: "localhost",
  database: "atlas",
  password: "postgres",
});

// obtener todos los entrenamientos con ejercicios y comidas
async function getAllEntrenamientos() {
  const result = await dbClient.query("SELECT * FROM entrenamiento");
  return result.rows;
}

// obtener un entrenamiento por id, incluyendo ejercicios y comidas
async function getOneEntrenamiento(id) {
  const entrenamiento = await dbClient.query("SELECT * FROM entrenamiento WHERE id = $1", [id]);
  
  const ejercicios = await dbClient.query(`
    SELECT ar.*
    FROM entrenamiento_ejercicio ee
    JOIN arma_rutina ar ON ar.id = ee.rutina_id
    WHERE ee.entrenamiento_id = $1
  `, [id]);

  const comidas = await dbClient.query(`
    SELECT a.*
    FROM entrenamiento_alimentacion ea
    JOIN alimentacion a ON a.id = ea.alimentacion_id
    WHERE ea.entrenamiento_id = $1
  `, [id]);

  return {
    ...entrenamiento.rows[0],
    ejercicios: ejercicios.rows,
    comidas: comidas.rows,
  };
}

// crear un nuevo entrenamiento relacionandolo con los ejercicios y comidas
async function createEntrenamiento(data) {
  const {
    dia_semana,
    objetivo,
    nivel_usuario,
    duracion_minutos,
    descripcion,
    ejercicios,
    comidas,
  } = data;

  const entrenamiento = await dbClient.query(`
    INSERT INTO entrenamiento (dia_semana, objetivo, nivel_usuario, duracion_minutos, descripcion)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `, [dia_semana, objetivo, nivel_usuario, duracion_minutos, descripcion]);

  const entrenamientoId = entrenamiento.rows[0].id;

  for (const rutinaId of ejercicios || []) {
    await dbClient.query(`
      INSERT INTO entrenamiento_ejercicio (entrenamiento_id, rutina_id)
      VALUES ($1, $2)
    `, [entrenamientoId, rutinaId]);
  }

  for (const comidaId of comidas || []) {
    await dbClient.query(`
      INSERT INTO entrenamiento_alimentacion (entrenamiento_id, alimentacion_id)
      VALUES ($1, $2)
    `, [entrenamientoId, comidaId]);
  }

  return entrenamiento.rows[0];
}

// actualizar un entrenamiento
async function updateEntrenamiento(id, data) {
  const {
    dia_semana,
    objetivo,
    nivel_usuario,
    duracion_minutos,
    descripcion,
  } = data;

  const result = await dbClient.query(`
    UPDATE entrenamiento SET
      dia_semana = $1,
      objetivo = $2,
      nivel_usuario = $3,
      duracion_minutos = $4,
      descripcion = $5
    WHERE id = $6
    RETURNING *
  `, [dia_semana, objetivo, nivel_usuario, duracion_minutos, descripcion, id]);

  return result.rows[0];
}

// eliminar un entrenamiento y sus relaciones
async function deleteEntrenamiento(id) {
  // primero elimino relaciones
  await dbClient.query("DELETE FROM entrenamiento_ejercicio WHERE entrenamiento_id = $1", [id]);
  await dbClient.query("DELETE FROM entrenamiento_alimentacion WHERE entrenamiento_id = $1", [id]);

  // luego elimino el entrenamiento
  const result = await dbClient.query("DELETE FROM entrenamiento WHERE id = $1", [id]);

  if (result.rowCount === 0) {
    return "Entrenamiento no encontrado";
  }

  return id;
}

module.exports = {
  getAllEntrenamientos,
  getOneEntrenamiento,
  createEntrenamiento,
  updateEntrenamiento,
  deleteEntrenamiento
};
