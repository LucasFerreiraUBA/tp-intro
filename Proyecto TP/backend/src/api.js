const express = require('express');
var cors = require('cors'); // Importamos cors para permitir peticiones desde el frontend

const app = express();
app.use(express.json());
app.use(cors()); 


const PORT = process.env.PORT || 3000;

const {
  getAllEjercicios,
  getOneEjercicios,
  createEjercicio,
  deleteEjercicio,
  getAllGrupo_musculares,
  updateEjercicio,
  updateEjercicioById,
} = require('../scripts/ejercicios.js');  // llama al archivo atlas para hacer las consultas a la base de datos

const {
  getAllComidas,
  getOneComida,
  createComida,
  deleteComida,
  updateComida
} = require('../scripts/alimentacion');

const {
  getAllEntrenamientos,
  getOneEntrenamiento,
  createEntrenamiento,
  deleteEntrenamiento,
  updateEntrenamiento,
} = require("../scripts/entrenamiento");

// Sample route
app.get('/api/health', (req, res) => { //http://localhost:3000/api/health
  res.json({ status: 'Todo OK' });
});
//---------------------------------------------- grupo_muscular ---------------------------------------------------------------------------
app.get('/api/grupo_muscular', async (req, res) => {
  const grupo_musculares = await getAllGrupo_musculares(); 
  res.json(grupo_musculares);
});

//---------------------------------------------- arma_rutina ---------------------------------------------------------------------------

//arma_rutina
  // END point

// get all
app.get('/api/ejercicios', async (req, res) => {
  try {
    const ejercicios = await getAllEjercicios();
    res.json(ejercicios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


// get one
app.get('/api/ejercicios/:id', async (req, res) => { // get one mediante el id
  const ejercicios = await getOneEjercicios(req.params.id); 
  
  if (!ejercicios) {
    return res.status(404).json({ error: 'Ejercicio no encontrado' });
  }

  res.json(ejercicios);
});

app.post('/api/ejercicios', async (req, res) => { 
  const {
    ejercicio,
    repeticiones,
    series,
    peso,
    grupo_muscular,  
    rir,
    tiempo_descanso,
    descripcion,
    entrenamiento_id
  } = req.body;

  if (
    !req.body.ejercicio || 
    !req.body.repeticiones ||
    !req.body.series ||  
    !req.body.grupo_muscular ||
    !req.body.entrenamiento_id) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' }); // ckeckea que los datos obligatorios esten presentes
  }
  
  const ejercicios = await createEjercicio(
    ejercicio,
    repeticiones,
    series,
    peso,
    grupo_muscular, 
    rir,
    tiempo_descanso,
    descripcion,
    entrenamiento_id
  );

  if (!ejercicios) {
    return res.status(500).json({ error: 'Error al crear el ejercicio' });
  }
  res.json(ejercicios);
});

// delete

// delete personaje
/*
curl --request DELET http://localhost:3000/api/personajes/id
*/

app.delete('/api/ejercicios/:id', async (req, res) => { 
  const ejercicios = await deleteEjercicio(req.params.id); 

  if (!ejercicios) {
    return res.status(404).json({ error: 'Ejercicio no encontrado' });
  }

  res.json({ status: 'OK', id: ejercicios });
});

// update
app.put('/api/ejercicios/:id', async (req, res) => {
  const ejercicio = await updateEjercicio(
    req.params.id,
    req.body.ejercicio,
    req.body.repeticiones, 
    req.body.peso,
    req.body.grupo_muscular,
    req.body.rir,
    req.body.tiempo_descanso,
    req.body.descripcion
  );

  if (!ejercicio) {
      return res.status(404).json({ error: 'Ejercicio no encontrado para actualizar' });
    }
  res.json(ejercicio);
});

app.patch('/api/ejercicios/:id', async (req, res) => {
  const { id } = req.params;

  const {
    ejercicio,
    repeticiones,
    series,
    peso,
    grupo_muscular_id,
    rir,
    tiempo_descanso,
    descripcion,
  } = req.body;
  if (grupo_muscular_id === undefined || grupo_muscular_id === null) {
    return res.status(400).json({ error: 'grupo_muscular_id es obligatorio' });
  }
  
  try {
    const actualizado = await updateEjercicioById(id, 
      ejercicio,
      repeticiones,
      series,
      peso,
      grupo_muscular_id,
      rir,
      tiempo_descanso,
      descripcion,
    );

    if (!actualizado) {
      return res.status(404).json({ error: 'Ejercicio no encontrado' });
    }

    res.status(200).json({ mensaje: 'Ejercicio actualizado con éxito', ejercicio: actualizado });
  } catch (error) {
    console.error('Error al actualizar ejercicio:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

//---------------------------------------------------------------alimentacion----------------------------------------------------------------

//Obtiene todas las comidas
app.get('/api/alimentacion', async (req, res) => {
    const comidas = await getAllComidas();
    res.json(comidas);
});

//Obtiene una comida por id
app.get('/api/alimentacion/:id', async (req, res) => {
    const comida = await getOneComida(req.params.id);
    if (!comida) {
      return res.status(404).json({ error: 'Comida no encontrada' });
    }
    res.json(comida);
});

//Crear una nueva comida
app.post('/api/alimentacion', async (req, res) => {
  const {
    nombre_comida,
    tipo_comida,
    calorias,
    proteinas,
    carbohidratos,
    grasas,
    ejercicio_relacionado, 
    descripcion
  } = req.body;

  
  if (!nombre_comida || !tipo_comida || !calorias || !proteinas || !carbohidratos || !grasas) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  // Crear la comida
  const comida = await createComida(
    nombre_comida,
    tipo_comida,
    calorias,
    proteinas,
    carbohidratos,
    grasas,
    ejercicio_relacionado, 
    descripcion
  );

  if (!comida) {
    return res.status(500).json({ error: 'Error al crear la comida' });
  }

  res.json(comida);
});

//Actualizar comida
app.put('/api/alimentacion/:id', async (req, res) => {
    const comida = await updateComida(
        req.params.id,
        req.body.nombre_comida,
        req.body.tipo_comida,
        req.body.calorias,
        req.body.proteinas,
        req.body.carbohidratos,
        req.body.grasas,
        req.body.ejercicio_relacionado,
        req.body.descripcion
    );
    if (!comida) {
      return res.status(404).json({ error: 'Comida no encontrada para actualizar' });
    }
    res.json(comida);
});

//Eliminar comida
app.delete('/api/alimentacion/:id', async (req, res) => {
    const comida = await deleteComida(req.params.id);
    if (!comida) {
      return res.status(404).json({ error: 'Comida no encontrada' });
    }
    res.json({ status: 'OK', id: comida });
});

//----------------------------------------------------------Entrenamiento--------------------------------------------------------------------

// Obtener todos los entrenamientos
app.get("/api/entrenamientos", async (req, res) => {
  const entrenamientos = await getAllEntrenamientos();
  res.json(entrenamientos);
});

// Obtener un entrenamiento completo por id
app.get("/api/entrenamientos/:id", async (req, res) => {
  const entrenamiento = await getOneEntrenamiento(parseInt(req.params.id));
  if (!entrenamiento) {
    return res.status(404).json({ error: "Entrenamiento no encontrado" });
  }
  res.json(entrenamiento);
});

// Crear un nuevo entrenamiento
app.post("/api/entrenamientos", async (req, res) => {
  const {
    dia_semana,
    objetivo,
    nivel_usuario,
    duracion_minutos,
    descripcion,
    ejercicios,
    comidas
  } = req.body;

  if (!dia_semana || !objetivo) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }
  //Crea el entrenamiento
  const entrenamiento = await createEntrenamiento({
    dia_semana,
    objetivo,
    nivel_usuario,
    duracion_minutos,
    descripcion,
    ejercicios: ejercicios || [],
    comidas: comidas || []
  });

  if (!entrenamiento) {
    return res.status(500).json({ error: "Error al crear el entrenamiento" });
  }

  res.json(entrenamiento);
});

// Actualizar entrenamiento
app.put("/api/entrenamientos/:id", async (req, res) => {
  const entrenamiento = await updateEntrenamiento(
    req.params.id,
    req.body.dia_semana,
    req.body.objetivo,
    req.body.nivel_usuario,
    req.body.duracion_minutos,
    req.body.descripcion,
    req.body.ejercicios,
    req.body.comidas
  );

  if (!entrenamiento) {
    return res.status(404).json({ error: "Entrenamiento no encontrado para actualizar" });
  }

  res.json(entrenamiento);
});

// Eliminar entrenamiento
app.delete("/api/entrenamientos/:id", async (req, res) => {
  const entrenamiento = await deleteEntrenamiento(req.params.id);

  if (!entrenamiento) {
    return res.status(404).json({ error: "Entrenamiento no encontrado" });
  }

  res.json({ status: "OK", id: entrenamiento.id });
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en https://localhost:${PORT}`);
});
