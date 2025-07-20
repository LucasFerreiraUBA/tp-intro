import {RUTAS} from "../constantes/rutas.mjs"
import { PatchOneById } from "../utils/APIFetch.mjs"


const modalEditar = document.getElementById("modal-editar-ejercicio");
const formEditar = document.getElementById("form-editar-ejercicio");

document.getElementById("cancelar-modal-editar").addEventListener("click", () => {
    modalEditar.close();
});

formEditar.addEventListener("submit", async (e) =>{
    e.preventDefault();
    const formData = new FormData(formEditar);
    const descripcion = formEditar.descripcion.value.trim();
    const ejercicio = formEditar.ejercicio.value.trim();
    const series = formEditar.series.value.trim();
    const repeticiones = formEditar.repeticiones.value.trim();

    if (descripcion.length > 100) {
        alert("La descripción no puede superar los 100 caracteres.");
        return; 
    } else if (ejercicio.length > 50) {
        alert("El nombre del ejercicio es demasiado largo.");
        return; 
    } else if (series < 0  || repeticiones < 0) {
        alert("Las series y repeticiones deben ser números positivos.");
        return; 
    } else if (isNaN(series) || isNaN(repeticiones)) {
        alert("Las series y repeticiones deben ser números válidos.");
        return; 
    }
    const musculos = await GetMusculos(RUTAS.MUSCULOS)
    const musculo = musculos.find( m => m.nombre == formEditar.grupo_muscular.value)
    const datos = {
        id: parseInt(formEditar.id.value),
        grupo_muscular_id: parseInt(musculo.id),
        ejercicio: formEditar.ejercicio.value,
        series: parseInt(formEditar.series.value),
        repeticiones: parseInt(formEditar.repeticiones.value),
        peso: parseFloat(formEditar.peso.value),
        unidad_peso_ejercicio: formEditar.unidad_peso.value,
        rir: parseInt(formEditar.rir.value),
        tiempo_descanso: parseFloat(formEditar.tiempo_descanso.value),
        unidad_descanso_ejercicio: formEditar.unidad_descanso.value,
        descripcion: formEditar.descripcion.value
    };
    await editarEjercicio(datos)
})

export const AbrirModalEditar = ej => {
    modalEditar.showModal();

    formEditar.id.value = ej.id;
    formEditar.grupo_muscular.value = ej.grupo_muscular;
    formEditar.ejercicio.value = ej.ejercicio;
    formEditar.series.value = ej.series;
    formEditar.repeticiones.value = ej.repeticiones;
    formEditar.peso.value = ej.peso;
    formEditar.unidad_peso.value = ej.unidad_peso_ejercicio;
    formEditar.rir.value = ej.rir ?? 1;
    formEditar.tiempo_descanso.value = ej.tiempo_descanso;
    formEditar.unidad_descanso.value = ej.unidad_descanso_ejercicio;
    formEditar.descripcion.value = ej.descripcion ?? "";
}
const editarEjercicio = async (datos) => {
    const ejercicio_URL = `${RUTAS.EJERCICIOS}/${datos.id}`;
    const respuesta = await PatchOneById(ejercicio_URL, datos);
    if (respuesta.ok) {
        modalEditar.close();
        alert("Ejercicio modificado correctamente");
        location.reload();
    } else {
        alert("Ocurrió un error al modificar el ejercicio");
    }
}

const GetMusculos = async (ruta) =>{
    const respuesta = await fetch(ruta).then( res => res.json());
    return respuesta;

}