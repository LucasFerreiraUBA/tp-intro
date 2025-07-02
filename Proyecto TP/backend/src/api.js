const express = require('express');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

const {
  getAllEjercicios,
  getOneEjercicios,
  createEjercicio,
  deleteEjercicio,
  getAllGrupo_musculares,
} = require('../scripts/arma_rutina');  // llama al archivo atlas para hacer las consultas a la base de datos


// Sample route
app.get('/api/health', (req, res) => { //http://localhost:3000/api/health
  res.json({ status: 'Todo OK' });
});
//---------------------------------------------- gurpo_muscular ---------------------------------------------------------------------------
app.get('/api/grupo_muscular', async (req, res) => {
  const grupo_musculares = await getAllGrupo_musculares(); 
  res.json(grupo_musculares);
});

//---------------------------------------------- arma_rutina ---------------------------------------------------------------------------

//arma_rutina
  // END point

// get all
app.get('/api/arma_rutina', async (req, res) => {
  const ejercicios = await getAllEjercicios(); 
  res.json(ejercicios);
});

// get one
app.get('/api/arma_rutina/:id', async (req, res) => { // get one mediante el id
  const ejercicios = await getOneEjercicios(req.params.id); 
  
  if (!ejercicios) {
    return res.status(404).json({ error: 'Ejercicio no encontrado' });
  }

  res.json(ejercicios);
});

app.post('/api/arma_rutina', async (req, res) => { 

  if (
    !req.body.ejercicio || 
    !req.body.repeticiones || 
    !req.body.peso || 
    !req.body.grupo_muscular) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' }); // ckeckea que los datos obligatorios esten presentes
  }
  
  const ejercicios = await createEjercicio(
    req.body.ejercicio,
    req.body.repeticiones,
    req.body.peso,
    req.body.grupo_muscular,
    req.body.rir,
    req.body.tiempo_descanso,
    req.body.descripcion  
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

app.delete('/api/arma_rutina/:id', async (req, res) => { 
  const ejercicios = await deleteEjercicio(req.params.id); 

  if (!ejercicios) {
    return res.status(404).json({ error: 'Ejercicio no encontrado' });
  }

  res.json({ status: 'OK', id: ejercicios });
});

// update
app.delete('/api/arma_rutina', (req, res) => { 
  res.json({ status: 'Todo OK' });
});

app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});
