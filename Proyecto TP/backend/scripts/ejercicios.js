// encargado de hacer las consultas a la base de datos y devolverlas a la API

const { Pool } = require("pg");

require('dotenv').config();

const dbClient = new Pool({
  //connectionString: process.env.DATABASE_URL,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
});

async function getAllEjercicios() {
  const result = await dbClient.query(`
    SELECT 
      ar.id,
      ar.ejercicio,
      ar.repeticiones,
      ar.peso,
      ar.unidad_peso_ejercicio,
      gm.nombre AS grupo_muscular,
      ar.rir,
      ar.tiempo_descanso,
      ar.unidad_descanso_ejercicio,
      ar.descripcion
    FROM 
      arma_rutina ar
    JOIN 
      grupo_muscular gm ON ar.grupo_muscular_id = gm.id
  `);
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
      ar.unidad_peso_ejercicio,
      gm.nombre AS grupo_muscular,
      ar.rir,
      ar.tiempo_descanso,
      ar.unidad_descanso_ejercicio,
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
  series,
  peso,
  unidad_peso_ejercicio,
  grupo_muscular_nombre,
  rir,
  tiempo_descanso,
  unidad_descanso_ejercicio,
  descripcion,
  entrenamiento_id
) {
  try {
    //busca el id del grupo muscular por su nombre
    const grupoResult = await dbClient.query(
      'SELECT id FROM grupo_muscular WHERE nombre = $1',
      [grupo_muscular_nombre]
    );

     const UnidadesDescansoValidos = ['Seg', 'Min'];
     const PesosValidos = ['Lb', 'Kg'];

    if (descripcion.length > 100) {
        console.error("La descripción es demasiado larga");
        return null; 
    } else if (ejercicio.length > 50) {
        console.error("El nombre del ejercicio es demasiado largo");
        return null;
    } else if (repeticiones < 1 || series < 1) {
        console.error("Las repeticiones y series deben ser al menos 1");
        return null; 
    } else if (repeticiones > 100 || series > 100) {
        console.error("Las repeticiones y series no pueden ser mayores a 100");
        return null;
    } else if (peso < 0) {
        console.error("El peso no puede ser negativo");  
        return null; 
     } else if (unidad_descanso_ejercicio && !UnidadesDescansoValidos.includes(unidad_descanso_ejercicio)) {
         throw new Error(`La unidad de descanso debe ser: ${UnidadesDescansoValidos.join(', ')}`);
     } else if (unidad_peso_ejercicio && !PesosValidos.includes(unidad_peso_ejercicio)) {
         throw new Error(`La unidad de peso debe ser: ${PesosValidos.join(', ')}`);
    } else if (peso > 2000) {
        console.error("El peso no puede ser mayor a 2000");
        return null; 
    } else if (tiempo_descanso < 0) {
        console.error("El tiempo de descanso no puede ser negativo");
        return null; 
    } else if (tiempo_descanso > 1000) {
        console.error("El tiempo de descanso es demasiado largo");
        return null; 
    } else if (isNaN(series) || isNaN(repeticiones)) {
        alert("Las series y repeticiones deben ser números válidos.");
        return; 
    } else if (isNaN(peso)) {
        alert("El peso debe ser un número válido.");
        return;
    } else if (isNaN(rir)) {
        alert("El RIR debe ser un número válido.");
        return; 
    }

    if (grupoResult.rowCount === 0) {
      return null;
    }

    const grupo_muscular_id = grupoResult.rows[0].id;

    const result = await dbClient.query(
      `INSERT INTO arma_rutina 
        (ejercicio, repeticiones, series, peso, unidad_peso_ejercicio, grupo_muscular_id, rir, tiempo_descanso, unidad_descanso_ejercicio, descripcion) 
      VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
      RETURNING id`,
      [ejercicio, repeticiones, series, peso, unidad_peso_ejercicio, grupo_muscular_id, rir, tiempo_descanso, unidad_descanso_ejercicio, descripcion]
    );

    const arma_rutina_id = result.rows[0].id;
    
    await dbClient.query(
      `INSERT INTO entrenamiento_ejercicio (entrenamiento_id, rutina_id)
      VALUES ($1, $2)`,
      [entrenamiento_id, arma_rutina_id]
      );
    
    return result.rows[0];
    
  } catch(error) {
    console.error("Error al crear el ejercicio", error);
    return null;
  }


}

async function deleteEjercicio(entrenamientoId, rutinaId) {

  // 1. Eliminar la relación en tabla puente
  await dbClient.query(
    "DELETE FROM entrenamiento_ejercicio WHERE entrenamiento_id = $1 AND rutina_id = $2",
    [entrenamientoId, rutinaId]
  );

  // 2. Eliminar el ejercicio en arma_rutina
  const result = await dbClient.query(
    "DELETE FROM arma_rutina WHERE id = $1",
    [rutinaId]
  );

  if (result.rowCount === 0) {
    return null; 
  }

  return true;
}

async function updateEjercicio(id, ejercicio, repeticiones, peso, unidad_peso_ejercicio, grupo_muscular_id, rir, tiempo_descanso, unidad_descanso_ejercicio, descripcion) {
  const result = await dbClient.query(`
    UPDATE arma_rutina SET
      ejercicio = $1,
      repeticiones = $2,
      peso = $3,
      unidad_peso_ejercicio = $4,
      grupo_muscular_id = $5,
      rir = $6,
      tiempo_descanso = $7,
      unidad_descanso_ejercicio = $8,
      descripcion = $9
    WHERE id = $10 RETURNING *`, 
  [ejercicio, repeticiones, peso, unidad_peso_ejercicio, grupo_muscular_id, rir, tiempo_descanso, unidad_descanso_ejercicio, descripcion, id]);

   const UnidadesDescansoValidos = ['Seg', 'Min'];
   const PesosValidos = ['Lb', 'Kg'];

    if (descripcion.length > 100) {
        console.error("La descripción es demasiado larga");
        return null; 
    } else if (ejercicio.length > 50) {
        console.error("El nombre del ejercicio es demasiado largo");
        return null;
    } else if (repeticiones < 1 || series < 1) {
        console.error("Las repeticiones y series deben ser al menos 1");
        return null; 
    } else if (repeticiones > 100 || series > 100) {
        console.error("Las repeticiones y series no pueden ser mayores a 100");
        return null;
    } else if (peso < 0) {
        console.error("El peso no puede ser negativo");  
        return null; 

     } else if (unidad_descanso_ejercicio && !UnidadesDescansoValidos.includes(unidad_descanso_ejercicio)) {
         throw new Error(`La unidad de descanso debe ser: ${UnidadesDescansoValidos.join(', ')}`);
     } else if (unidad_peso_ejercicio && !PesosValidos.includes(unidad_peso_ejercicio)) {
         throw new Error(`La unidad de peso debe ser: ${PesosValidos.join(', ')}`);
    } else if (peso > 2000) {
        console.error("El peso no puede ser mayor a 2000");
        return null; 
    } else if (tiempo_descanso < 0) {
        console.error("El tiempo de descanso no puede ser negativo");
        return null; 
    } else if (tiempo_descanso > 1000) {
        console.error("El tiempo de descanso es demasiado largo");
        return null; 
    } else if (isNaN(series) || isNaN(repeticiones)) {
        alert("Las series y repeticiones deben ser números válidos.");
        return; 
    } else if (isNaN(peso)) {
        alert("El peso debe ser un número válido.");
        return;
    } else if (isNaN(rir)) {
        alert("El RIR debe ser un número válido.");
        return; 
    }

  if (result.rows.length === 0) {
    return null
  }

  return result.rows[0];
}

async function updateEjercicioById(
  id,
  ejercicio,
  repeticiones,
  series,
  peso,
  unidad_peso_ejercicio,
  grupo_muscular_id,
  rir,
  tiempo_descanso,
  unidad_descanso_ejercicio,
  descripcion
) {

  const result = await dbClient.query(`
    UPDATE arma_rutina SET
      ejercicio = $1,
      repeticiones = $2,
      series = $3,
      peso = $4,
      unidad_peso_ejercicio = $5,
      grupo_muscular_id = $6,
      rir = $7,
      tiempo_descanso = $8,
      unidad_descanso_ejercicio = $9,
      descripcion = $10
    WHERE id = $11
    RETURNING *;
  `, [
    ejercicio,
    repeticiones,
    series,
    peso,
    unidad_peso_ejercicio,
    grupo_muscular_id,
    rir,
    tiempo_descanso,
    unidad_descanso_ejercicio,
    descripcion,
    id
  ]);


   const UnidadesDescansoValidos = ['Seg', 'Min'];
   const PesosValidos = ['Lb', 'Kg'];

    if (descripcion.length > 100) {
        console.error("La descripción es demasiado larga");
        return null; 
    } else if (ejercicio.length > 50) {
        console.error("El nombre del ejercicio es demasiado largo");
        return null;
    } else if (repeticiones < 1 || series < 1) {
        console.error("Las repeticiones y series deben ser al menos 1");
        return null; 
    } else if (repeticiones > 100 || series > 100) {
        console.error("Las repeticiones y series no pueden ser mayores a 100");
        return null;
    } else if (peso < 0) {
        console.error("El peso no puede ser negativo");  
        return null; 
     } else if (unidad_descanso_ejercicio && !UnidadesDescansoValidos.includes(unidad_descanso_ejercicio)) {
         throw new Error(`La unidad de descanso debe ser: ${UnidadesDescansoValidos.join(', ')}`);
     } else if (unidad_peso_ejercicio && !PesosValidos.includes(unidad_peso_ejercicio)) {
         throw new Error(`La unidad de peso debe ser: ${PesosValidos.join(', ')}`);
    } else if (peso > 2000) {
        console.error("El peso no puede ser mayor a 2000");
        return null; 
    } else if (tiempo_descanso < 0) {
        console.error("El tiempo de descanso no puede ser negativo");
        return null; 
    } else if (tiempo_descanso > 1000) {
        console.error("El tiempo de descanso es demasiado largo");
        return null; 
    } else if (isNaN(series) || isNaN(repeticiones)) {
        alert("Las series y repeticiones deben ser números válidos.");
        return; 
    } else if (isNaN(peso)) {
        alert("El peso debe ser un número válido.");
        return;
    } else if (isNaN(rir)) {
        alert("El RIR debe ser un número válido.");
        return; 
    }


  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0]; 
}

module.exports = {
  getAllEjercicios,
  getOneEjercicios,
  createEjercicio,
  deleteEjercicio,
  getAllGrupo_musculares,
  updateEjercicio,
  updateEjercicioById
};
