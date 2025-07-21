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
  const result = await dbClient.query(
    `SELECT 
      e.id,
      e.dia_semana,
      e.objetivo,
      e.nivel_usuario,
      e.duracion_minutos,
      e.unidad_descanso,
      e.descripcion,
      SUM(a.calorias) AS calorias,
      SUM(a.proteinas) AS proteinas,
      SUM(a.carbohidratos) AS carbohidratos, 
      SUM(a.grasas) AS grasas
    FROM entrenamiento e
    LEFT JOIN entrenamiento_alimentacion ea ON e.id = ea.entrenamiento_id
    LEFT JOIN alimentacion a ON ea.alimentacion_id = a.id
    GROUP BY e.id
    ORDER BY e.id`
  );
  return result.rows;
}

// obtener un entrenamiento por id, incluyendo ejercicios y comidas
async function getOneEntrenamiento(id) {
  const entrenamiento = await dbClient.query("SELECT * FROM entrenamiento WHERE id = $1", [id]);
  const ejercicios = await dbClient.query(`
    SELECT 
      ar.id,
      ar.ejercicio,
      ar.series,
      ar.repeticiones,
      ar.peso,
      ar.unidad_peso_ejercicio,
      gm.nombre AS grupo_muscular,
      ar.rir,
      ar.tiempo_descanso,
      ar.unidad_descanso_ejercicio,
      ar.descripcion
    FROM entrenamiento_ejercicio ee
    JOIN arma_rutina ar ON ar.id = ee.rutina_id
    JOIN grupo_muscular gm ON ar.grupo_muscular_id = gm.id
    WHERE ee.entrenamiento_id = $1
  `, [id]);
  
   const comidas = await dbClient.query(`
    SELECT
    a.id,
    a.nombre_comida,
    a.tipo_comida,
    a.calorias,
    a.proteinas,
    a.carbohidratos,
    a.grasas,
    ar.ejercicio AS ejercicio_relacionado,
    a.descripcion
    FROM entrenamiento_alimentacion ea
    JOIN alimentacion a ON a.id = ea.alimentacion_id
    LEFT JOIN arma_rutina ar ON a.rutina_id = ar.id
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
    unidad_descanso = 'Min', // Valor por defecto
    descripcion,
    ejercicios,
    comidas,
  } = data;

  const entrenamiento = await dbClient.query(`
    INSERT INTO entrenamiento (dia_semana, objetivo, nivel_usuario, duracion_minutos, unidad_descanso, descripcion)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `, [dia_semana, objetivo, nivel_usuario, duracion_minutos, unidad_descanso, descripcion]);

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
    unidad_descanso,
    descripcion,
  } = data;

  const result = await dbClient.query(`
    UPDATE entrenamiento SET
      dia_semana = $1,
      objetivo = $2,
      nivel_usuario = $3,
      duracion_minutos = $4,
      unidad_descanso = $5,
      descripcion = $6
    WHERE id = $7
    RETURNING *
  `, [dia_semana, objetivo, nivel_usuario, duracion_minutos, unidad_descanso, descripcion, id]);

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

const updateEntrenamientoById = async ( id, data ) =>{
  const {
    dia_semana,
    objetivo,
    nivel_usuario,
    duracion_minutos,
    unidad_descanso,
    descripcion,
  } = data;
  const result = await dbClient.query(`
    UPDATE entrenamiento SET
      dia_semana = $1,
      objetivo = $2,
      nivel_usuario = $3,
      duracion_minutos = $4,
      unidad_descanso = $5,
      descripcion = $6
    WHERE id = $7
    RETURNING *
  `, [dia_semana, objetivo, nivel_usuario, duracion_minutos, unidad_descanso, descripcion, id]);

  return result.rows[0];
}
module.exports = {
  getAllEntrenamientos,
  getOneEntrenamiento,
  createEntrenamiento,
  updateEntrenamiento,
  deleteEntrenamiento,
  updateEntrenamientoById
};
