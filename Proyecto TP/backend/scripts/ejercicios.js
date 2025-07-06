// encargado de hacer las consultas a la base de datos y devolverlas a la API

const { Pool } = require("pg");

const dbClient = new Pool({// conectandonos con la base de datos
  user: "postgres",
  port: 5432,
  host: "localhost",
  database: "atlas",
  password: "postgres",
});

async function getAllEjercicios() {
  const result = await dbClient.query(`
    SELECT 
      ar.id,
      ar.ejercicio,
      ar.repeticiones,
      ar.peso,
      gm.nombre AS grupo_muscular,
      ar.rir,
      ar.tiempo_descanso,
      ar.descripcion
    FROM 
      arma_rutina ar
    JOIN 
      grupo_muscular gm ON ar.grupo_muscular_id = gm.id
  `); // hacemos un JOIN entre la tabla arma_rutina y grupo_muscular para obtener el nombre del grupo muscular a partir del ID 
  return result.rows;
}

async function getAllGrupo_musculares() {
  const result = await dbClient.query("SELECT * FROM grupo_muscular");
  return result.rows;
}

async function getOneEjercicios(id) {
  const result = await dbClient.query(`
    SELECT 
      ar.id,
      ar.ejercicio,
      ar.repeticiones,
      ar.peso,
      gm.nombre AS grupo_muscular,
      ar.rir,
      ar.tiempo_descanso,
      ar.descripcion
    FROM 
      arma_rutina ar
    JOIN 
      grupo_muscular gm ON ar.grupo_muscular_id = gm.id
    WHERE 
      ar.id = $1
    LIMIT 1
  `, [id]);

  return result.rows[0];
}


async function createEjercicio(
    ejercicio,
    repeticiones,
    peso,
    grupo_muscular,
    rir,
    tiempo_descanso,
    descripcion,
    ) {
  const result = await dbClient.query(
    "INSERT INTO arma_rutina (ejercicio, repeticiones, peso, grupo_muscular, rir, tiempo_descanso, descripcion) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",

    [ejercicio, repeticiones, peso, grupo_muscular, rir, tiempo_descanso, descripcion]);
  
    console.log("rowCount", result.rowCount);
    return result.rows[0];
}

async function deleteEjercicio(id){
  const result = await dbClient.query("DELETE FROM arma_rutina WHERE id = $1", [id]); 
  
  if (result.rowCount === 0) {
    return ("Ejercicio no encontrado");
  }

  return id;
}

async function updateEjercicio(id, ejercicio, repeticiones, peso, grupo_muscular, rir, tiempo_descanso, descripcion) {
  const result = await dbClient.query(`
    UPDATE arma_rutina SET
      ejercicio = $1,
      repeticiones = $2,
      peso = $3,
      grupo_muscular = $4,
      rir = $5,
      tiempo_descanso = $6,
      descripcion = $7
    WHERE id = $8 RETURNING *`, 
  [ejercicio, repeticiones, peso, grupo_muscular, rir, tiempo_descanso, descripcion, id]);

  return result.rows[0];
}


module.exports = {
  getAllEjercicios,
  getOneEjercicios,
  createEjercicio,
  deleteEjercicio,
  getAllGrupo_musculares,
  updateEjercicio
};
