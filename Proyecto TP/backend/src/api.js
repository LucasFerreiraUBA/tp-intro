const express = require("express");
var cors = require("cors"); // Importamos cors para permitir peticiones desde el frontend

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
} = require("../scripts/ejercicios.js"); // llama al archivo atlas para hacer las consultas a la base de datos

const {
  getAllComidas,
  getOneComida,
  createComida,
  deleteComida,
  updateComida,
} = require("../scripts/alimentacion");

const {
  getAllEntrenamientos,
  getOneEntrenamiento,
  createEntrenamiento,
  deleteEntrenamiento,
  updateEntrenamiento,
  updateEntrenamientoById,
} = require("../scripts/entrenamiento");

// Sample route
app.get("/api/health", (req, res) => {
  //http://localhost:3000/api/health
  res.json({ status: "Todo OK" });
});
//---------------------------------------------- grupo_muscular ---------------------------------------------------------------------------
app.get("/api/grupo_muscular", async (req, res) => {
  const grupo_musculares = await getAllGrupo_musculares();
  res.json(grupo_musculares);
});

//---------------------------------------------- ejercicios ---------------------------------------------------------------------------

//arma_rutina
// END point

// get all
app.get("/api/ejercicios", async (req, res) => {
  try {
    const ejercicios = await getAllEjercicios();

    return res.status(200).json({
      status: 200,
      data: ejercicios,
    });
  } catch (error) {
    const mensaje =
      error instanceof Error ? error.message : "Error interno del servidor";
    return res.status(500).json({
      status: 500,
      error: mensaje,
    });
  }
});

// get one
app.get("/api/ejercicios/:id", async (req, res) => {
  try {
    const ejercicio = await getOneEjercicios(req.params.id);

    if (!ejercicio) {
      return res.status(404).json({
        status: 404,
        error: "Ejercicio no encontrado",
      });
    }

    return res.status(200).json({
      status: 200,
      data: ejercicio,
    });
  } catch (error) {
    const mensaje =
      error instanceof Error ? error.message : "Error interno del servidor";
    return res.status(500).json({ status: 500, error: mensaje });
  }
});

// Crear un nuevo ejercicio
app.post("/api/ejercicios", async (req, res) => {
  try {
    const {
      ejercicio,
      repeticiones,
      series,
      peso,
      unidad_peso_ejercicio,
      grupo_muscular,
      rir,
      tiempo_descanso,
      unidad_descanso_ejercicio,
      descripcion,
      entrenamiento_id,
    } = req.body;

    // Validación obligatoria
    if (
      !ejercicio ||
      !repeticiones ||
      !series ||
      !grupo_muscular ||
      !entrenamiento_id
    ) {
      return res.status(400).json({
        status: 400,
        message: "Faltan campos obligatorios",
      });
    }

    const nuevoEjercicio = await createEjercicio(
      ejercicio,
      repeticiones,
      series,
      peso,
      unidad_peso_ejercicio,
      grupo_muscular,
      rir,
      tiempo_descanso,
      unidad_descanso_ejercicio,
      descripcion,
      entrenamiento_id
    );

    if (!nuevoEjercicio) {
      return res.status(500).json({
        status: 500,
        error: "No se pudo crear el ejercicio",
      });
    }

    return res.status(201).json({
      status: 201,
      data: nuevoEjercicio,
    });
  } catch (error) {
    const mensaje =
      error instanceof Error ? error.message : "Error interno del servidor";
    return res.status(500).json({
      status: 500,
      error: mensaje,
    });
  }
});

// delete

// delete personaje
/*
curl --request DELET http://localhost:3000/api/personajes/id
*/

app.delete(
  "/api/entrenamientos/:entrenamientoId/ejercicios/:rutinaId",
  async (req, res) => {
    try {
      const { entrenamientoId, rutinaId } = req.params;
      const eliminado = await deleteEjercicio(entrenamientoId, rutinaId);

      if (!eliminado) {
        return res.status(404).json({
          status: 404,
          error: "Ejercicio no encontrado",
        });
      }

      return res.status(200).json({
        status: 200,
        message: `Ejercicio eliminado: ${rutinaId}`,
      });
    } catch (error) {
      const mensaje =
        error instanceof Error ? error.message : "Error interno del servidor";
      return res.status(500).json({
        status: 500,
        error: mensaje,
      });
    }
  }
);

// update
app.put("/api/ejercicios/:id", async (req, res) => {
  try {
    const ejercicio = await updateEjercicio(
      req.params.id,
      req.body.ejercicio,
      req.body.repeticiones,
      req.body.peso,
      req.body.unidad_peso_ejercicio,
      req.body.grupo_muscular,
      req.body.rir,
      req.body.tiempo_descanso,
      req.body.unidad_descanso_ejercicio,
      req.body.descripcion
    );

    if (!ejercicio) {
      return res.status(404).json({
        status: 404,
        error: "Ejercicio no encontrado para actualizar",
      });
    }

    return res.status(200).json({
      status: 200,
      data: ejercicio,
    });
  } catch (error) {
    const mensaje =
      error instanceof Error ? error.message : "Error interno del servidor";
    return res.status(500).json({
      status: 500,
      error: mensaje,
    });
  }
});

app.patch("/api/ejercicios/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
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
    } = req.body;

    if (grupo_muscular_id === undefined || grupo_muscular_id === null) {
      return res.status(400).json({
        status: 400,
        error: "grupo_muscular_id es obligatorio",
      });
    }
    const actualizado = await updateEjercicioById(
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
    );

    if (!actualizado) {
      return res.status(404).json({
        status: 404,
        error: "Ejercicio no encontrado",
      });
    }

    return res.status(200).json({
      status: 200,
      data: actualizado,
    });
  } catch (error) {
    const mensaje =
      error instanceof Error ? error.message : "Error interno del servidor";
    return res.status(500).json({ status: 500, error: mensaje });
  }
});

//---------------------------------------------------------------alimentacion----------------------------------------------------------------

//Obtiene todas las comidas
// GET ALL
app.get("/api/alimentacion", async (req, res) => {
  try {
    const comida = await getAllComidas();
    return res.status(200).json({
      status: 200,
      data: comida,
    });
  } catch (error) {
    const mensaje =
      error instanceof Error ? error.message : "Error interno del servidor";
    return res.status(500).json({
      status: 500,
      error: mensaje,
    });
  }
});

//GET ONE
app.get("/api/alimentacion/:id", async (req, res) => {
  try {
    const comida = await getOneComida(req.params.id);
    if (!comida) {
      return res.status(404).json({
        status: 404,
        error: "Comida no encontrada",
      });
    }

    return res.status(200).json({
      status: 200,
      data: comida,
    });
  } catch (error) {
    const mensaje =
      error instanceof Error ? error.message : "Error interno del servidor";
    return res.status(500).json({ status: 500, error: mensaje });
  }
});

//Crear una nueva comida
app.post("/api/alimentacion", async (req, res) => {
  try {
    const {
      nombre_comida,
      tipo_comida,
      calorias,
      proteinas,
      carbohidratos,
      grasas,
      descripcion,
      entrenamiento_id,
    } = req.body;

    if (
      !nombre_comida ||
      !tipo_comida ||
      !calorias ||
      !proteinas ||
      !carbohidratos ||
      !grasas ||
      !entrenamiento_id
    ) {
      return res.status(400).json({
        status: 400,
        error: "Faltan datos obligatorios",
      });
    }

    const nuevaComida = await createComida(
      nombre_comida,
      tipo_comida,
      calorias,
      proteinas,
      carbohidratos,
      grasas,
      descripcion,
      entrenamiento_id
    );

    if (!nuevaComida) {
      return res.status(500).json({
        status: 500,
        error: "No se pudo crear la comida",
      });
    }

    return res.status(201).json({
      status: 201,
      data: nuevaComida,
    });
  } catch (error) {
    const mensaje =
      error instanceof Error ? error.message : "Error interno del servidor";
    return res.status(500).json({
      status: 500,
      error: mensaje,
    });
  }
});

//Actualizar comida
app.put("/api/alimentacion/:id", async (req, res) => {
  try {
    const ActualizarComida = await updateComida(
      req.params.id,
      req.body.nombre_comida,
      req.body.tipo_comida,
      req.body.calorias,
      req.body.proteinas,
      req.body.carbohidratos,
      req.body.grasas,
      req.body.descripcion
    );
    if (!ActualizarComida) {
      return res.status(404).json({
        status: 404,
        error: "Comida no encontrada para actualizar",
      });
    }
    return res.status(201).json({
      status: 201,
      data: ActualizarComida,
    });
  } catch (error) {
    const mensaje =
      error instanceof Error ? error.message : "Error interno del servidor";
    return res.status(500).json({
      status: 500,
      error: mensaje,
    });
  }
});

//Eliminar comida
app.delete(
  "/api/entrenamientos/:entrenamientoId/alimentacion/:alimentacionId",
  async (req, res) => {
    try {
      const { entrenamientoId, alimentacionId } = req.params;
      const eliminado = await deleteComida(entrenamientoId, alimentacionId);

      if (!eliminado) {
        return res.status(404).json({
          status: 404,
          error: "Comida no encontrada",
        });
      }

      return res.status(200).json({
        status: 200,
        message: "Comida eliminada correctamente ${alimentacionId}",
      });
    } catch (error) {
      const mensaje =
        error instanceof Error ? error.message : "Error interno del servidor";
      return res.status(500).json({
        status: 500,
        error: mensaje,
      });
    }
  }
);

//----------------------------------------------------------Entrenamiento--------------------------------------------------------------------

// Obtener todos los entrenamientos
app.get("/api/entrenamientos", async (req, res) => {
  try {
    const entrenamientos = await getAllEntrenamientos();

    return res.status(200).json({
      status: 200,
      data: entrenamientos,
    });
  } catch (error) {
    const mensaje =
      error instanceof Error ? error.message : "Error interno del servidor";
    return res.status(500).json({
      status: 500,
      error: mensaje,
    });
  }
});

// Obtener un entrenamiento completo por id
app.get("/api/entrenamientos/:id", async (req, res) => {
  try {
    const entrenamiento = await getOneEntrenamiento(parseInt(req.params.id));
    if (!entrenamiento) {
      return res.status(404).json({
        status: 404,
        error: "Entrenamiento no encontrado",
      });
    }
    return res.status(200).json({
      status: 200,
      data: entrenamiento,
    });
  } catch (error) {
    const mensaje =
      error instanceof Error ? error.message : "Error interno del servidor";
    return res.status(500).json({ status: 500, error: mensaje });
  }
});

// Crear un nuevo entrenamiento
app.post("/api/entrenamientos", async (req, res) => {
  try {
    const {
      dia_semana,
      objetivo,
      nivel_usuario,
      duracion_minutos,
      unidad_descanso = "Min",
      descripcion,
      ejercicios,
      comidas,
    } = req.body;

    // Validaciones obligatorias
    if (!dia_semana || !objetivo || !nivel_usuario) {
      return res.status(400).json({
        status: 400,
        error: "Faltan datos obligatorios",
      });
    }

    // Validaciones de longitud
    if (objetivo.length > 25) {
      return res.status(400).json({
        status: 400,
        error: "El objetivo no puede exceder los 25 caracteres",
      });
    }

    if (descripcion && descripcion.length > 100) {
      return res.status(400).json({
        status: 400,
        error: "La descripción no puede exceder los 100 caracteres",
      });
    }

    const entrenamiento = await createEntrenamiento({
      dia_semana,
      objetivo,
      nivel_usuario,
      duracion_minutos,
      unidad_descanso,
      descripcion,
      ejercicios: ejercicios || [],
      comidas: comidas || [],
    });

    if (!entrenamiento) {
      return res.status(500).json({
        status: 500,
        error: "Error al crear el entrenamiento",
      });
    }

    return res.status(201).json({
      status: 201,
      data: entrenamiento,
    });
  } catch (error) {
    const mensaje =
      error instanceof Error ? error.message : "Error interno del servidor";
    return res.status(500).json({
      status: 500,
      error: mensaje,
    });
  }
});

// Actualizar entrenamiento
app.patch("/api/entrenamientos/:id", async (req, res) => {
  try {
    const {
      dia_semana,
      objetivo,
      nivel_usuario,
      duracion_minutos,
      unidad_descanso,
      descripcion
    } = req.body;

    const entrenamientoActualizado = await updateEntrenamientoById(
      req.params.id,
      {
        dia_semana,
        objetivo,
        nivel_usuario,
        duracion_minutos,
        unidad_descanso,
        descripcion
      }
    );

    if (!entrenamientoActualizado) {
      return res.status(404).json({
        status: 404,
        error: "Entrenamiento no encontrado para actualizar"
      });
    }

    return res.status(200).json({
      status: 200,
      data: entrenamientoActualizado
    });

  } catch (error) {
    const mensaje = error instanceof Error ? error.message : "Error interno del servidor";
    return res.status(500).json({
      status: 500,
      error: mensaje
    });
  }
});


// Eliminar entrenamiento
app.delete("/api/entrenamientos/:id", async (req, res) => {
  try {
    const entrenamiento = await deleteEntrenamiento(req.params.id);

    if (!entrenamiento) {
      return res.status(404).json({
        status: 404,
        error: "Entrenamiento no encontrado",
      });
    }

    return res.status(200).json({
      status: 200,
      message: `Entrenamiento eliminado: ${entrenamiento.id}`,
    });
  } catch (error) {
    const mensaje =
      error instanceof Error ? error.message : "Error interno del servidor";
    return res.status(500).json({
      status: 500,
      error: mensaje,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en https://localhost:${PORT}`);
});
