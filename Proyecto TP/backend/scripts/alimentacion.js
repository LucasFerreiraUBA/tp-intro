const { Pool } = require("pg");

const dbClient = new Pool({
    user: "postgres",
    port: 5432,
    host: "localhost",
    database: "atlas",
    password: "postgres",
});

async function getAllComidas() {
    const result = await dbClient.query(`
        SELECT
            a.id,
            a.nombre_comida,
            a.tipo_comida,
            a.calorias,
            a.proteinas,
            a.carbohidratos,
            a.grasas,
            ar.ejercicio as ejercicio_relacionado,
            a.descripcion
        FROM
            alimentacion a
        JOIN
            arma_rutina ar ON a.rutina_id = ar.id    
        `);
    return result.rows;    
}

async function getOneComida(id) {
    const result = await dbClient.query(`
        SELECT
            a.id,
            a.nombre_comida,
            a.tipo_comida,
            a.calorias,
            a.proteinas,
            a.carbohidratos,
            a.grasas,
            ar.ejercicio as ejercicio_relacionado,
            a.descripcion
        FROM
            alimentacion a
        JOIN
            arma_rutina ar ON a.rutina_id = ar.id
        WHERE
            a.id = $1
        LIMIT 1
        `, [id]);
    return result.rows[0];    
}

async function createComida(nombre_comida, tipo_comida, calorias, proteinas, carbohidratos, grasas, descripcion, entrenamiento_id) {
    try {
    const result = await dbClient.query(`
        INSERT INTO alimentacion (nombre_comida, tipo_comida, calorias, proteinas, carbohidratos, grasas, descripcion) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
    [nombre_comida, tipo_comida, calorias, proteinas, carbohidratos, grasas, descripcion]);

    const alimentacion_id = result.rows[0].id;

    await dbClient.query(
      `INSERT INTO entrenamiento_alimentacion (entrenamiento_id, alimentacion_id)
      VALUES ($1, $2)`,
      [entrenamiento_id, alimentacion_id]
      );

    return result.rows[0];
    } catch (error) {
        console.error("Error al crear la comida", error);
        return null;
    }
}

async function deleteComida(entrenamientoId, alimentacionId) {
  const result = await dbClient.query(
    "DELETE FROM entrenamiento_alimentacion WHERE entrenamiento_id = $1 AND alimentacion_id = $2",
    [entrenamientoId, alimentacionId]
  );

  if (result.rowCount === 0) {
    return null;
  }

  return true;
}

async function updateComida(id, nombre_comida, tipo_comida, calorias, proteinas, carbohidratos, grasas, ejercicio_relacionado, descripcion) {
    const result = await dbClient.query(`
        UPDATE alimentacion SET
            nombre_comida = $1,
            tipo_comida = $2,
            calorias = $3,
            proteinas = $4,
            carbohidratos = $5,
            grasas = $6,
            ejercicio_relacionado = $7,
            descripcion = $8
        WHERE id = $9 RETURNING *`, 
    [nombre_comida, tipo_comida, calorias, proteinas, carbohidratos, grasas, ejercicio_relacionado, descripcion, id]);

    return result.rows[0];
}

module.exports = {
    getAllComidas,
    getOneComida,
    createComida,
    deleteComida,
    updateComida
};
