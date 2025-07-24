const { Pool } = require("pg");

require('dotenv').config();

const dbClient = new Pool({
    connectionString: process.env.DATABASE_URL,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
});

async function getAllComidas() {
    const result = await dbClient.query("SELECT * FROM alimentacion");
    return result.rows;    
}

async function getOneComida(id) {
    const result = await dbClient.query("SELECT * FROM alimentacion WHERE a.id = $1 LIMIT 1", [id]);
    return result.rows[0];    
}

async function createComida(nombre_comida, tipo_comida, calorias, proteinas, carbohidratos, grasas, descripcion, entrenamiento_id) {
    try {
    const result = await dbClient.query(`
        INSERT INTO alimentacion (nombre_comida, tipo_comida, calorias, proteinas, carbohidratos, grasas, descripcion) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
    [nombre_comida, tipo_comida, calorias, proteinas, carbohidratos, grasas, descripcion]);

    const TipoComidaValido = ['Desayuno', 'Almuerzo', 'Merienda', 'Cena'];

    if (descripcion.length > 100) {
        throw new Error("La descripción es demasiado larga");
    } else if (nombre_comida.length > 50) {
        throw new Error("El nombre de la comida es demasiado largo");
    } else if (calorias < 0 || proteinas < 0 || grasas < 0 || carbohidratos < 0) {
        throw new Error("Las calorias, proteinas, grasas y los carbohidratos no pueden ser numeros negativos");   
    } else if (isNaN(calorias) || isNaN(proteinas) || isNaN(grasas) || isNaN(carbohidratos)) {
        throw new Error("Las calorias, proteinas, grasas y los carbohidratos deben ser números válidos.");
    } else if (tipo_comida && !TipoComidaValido.includes(tipo_comida)) {
        throw new Error(`El tipo de comida debe ser: ${TipoComidaValido.join(', ')}`);
    }

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

    // 1. Eliminar la relación en tabla puente
    await dbClient.query(
        "DELETE FROM entrenamiento_alimentacion WHERE entrenamiento_id = $1 AND alimentacion_id = $2",
        [entrenamientoId, alimentacionId]
    );

    // 2. Eliminar el ejercicio en alimentacion
    const result = await dbClient.query(
        "DELETE FROM alimentacion WHERE id = $1",
        [alimentacionId]
    );

    if (result.rowCount === 0) {
    return null;
    }

    return true;
}

async function updateComida(id, nombre_comida, tipo_comida, calorias, proteinas, carbohidratos, grasas, descripcion) {
    const result = await dbClient.query(`
        UPDATE alimentacion SET
            nombre_comida = $1,
            tipo_comida = $2,
            calorias = $3,
            proteinas = $4,
            carbohidratos = $5,
            grasas = $6,
            descripcion = $7
        WHERE id = $8 RETURNING *`, 
    [nombre_comida, tipo_comida, calorias, proteinas, carbohidratos, grasas, descripcion, id]);

    const TipoComidaValido = ['Desayuno', 'Almuerzo', 'Merienda', 'Cena'];

    if (descripcion.length > 100) {
        throw new Error("La descripción es demasiado larga"); 
    } else if (nombre_comida.length > 50) {
        throw new Error("El nombre de la comida es demasiado largo");
    } else if (calorias < 0 || proteinas < 0 || grasas < 0 || carbohidratos < 0) {
        throw new Error("Las calorias, proteinas, grasas y los carbohidratos no pueden ser numeros negativos");   
    } else if (isNaN(calorias) || isNaN(proteinas) || isNaN(grasas) || isNaN(carbohidratos)) {
        throw new Error("Las calorias, proteinas, grasas y los carbohidratos deben ser números válidos.");
    } else if (tipo_comida && !TipoComidaValido.includes(tipo_comida)) {
        throw new Error(`El tipo de comida debe ser: ${TipoComidaValido.join(', ')}`);
    }

    return result.rows[0];
}

module.exports = {
    getAllComidas,
    getOneComida,
    createComida,
    deleteComida,
    updateComida
};
