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
    const descripcionEdit = formEditar.descripcion.value.trim();
    const ejercicioEdit = formEditar.ejercicio.value.trim();
    const seriesEdit = formEditar.series.value.trim();
    const repeticionesEdit = formEditar.repeticiones.value.trim();
    const rirEdit = formEditar.rir.value.trim();
    const TiempoDescansoEdit = formEditar.tiempo_descanso.value.trim();

    // Validaciones
    if (descripcionEdit.length > 100) {
        alert("La descripción no puede superar los 100 caracteres.");
        return; 
    } else if (ejercicioEdit.length > 50) {
        alert("El nombre del ejercicio es demasiado largo.");
        return; 
    } else if (seriesEdit <= 0  || repeticionesEdit <= 0) {
        alert("Las series y repeticiones deben ser números positivos.");
        return; 
    } else if (rirEdit < 0){
        alert("El RIR debe ser un numero positivo");
        return;
    } else if (TiempoDescansoEdit < 0){
        alert("El Tiempo de Descanso debe ser un numero positivo");
        return;
    } else if (TiempoDescansoEdit === 0){
        alert("El Tiempo de Descanso no debe ser 0");
        return;
    }

    const musculos = await GetMusculos(RUTAS.MUSCULOS)
    const musculo = musculos.find( m => m.nombre == formEditar.grupo_muscular.value)
    const datos = {
        id: parseInt(formEditar.id.value),
        grupo_muscular_id: parseInt(musculo.id),
        ejercicio: ejercicioEdit,
        series: parseInt(seriesEdit),
        repeticiones: parseInt(repeticionesEdit),
        peso: parseFloat(formEditar.peso.value),
        unidad_peso_ejercicio: formEditar.unidad_peso.value,
        rir: parseInt(rirEdit),
        tiempo_descanso: parseFloat(TiempoDescansoEdit),
        unidad_descanso_ejercicio: formEditar.unidad_descanso.value,
        descripcion: descripcionEdit
    };
    await editarEjercicio(datos)
})

export const AbrirModalEditar = ej => {
    formEditar.id.value = ej.id;
    formEditar.grupo_muscular.value = ej.grupo_muscular;
    formEditar.ejercicio.value = ej.ejercicio;
    formEditar.series.value = ej.series;
    formEditar.repeticiones.value = ej.repeticiones;
    formEditar.peso.value = ej.peso;
    formEditar.unidad_peso.value = ej.unidad_peso_ejercicio;
    formEditar.rir.value = ej.rir;
    formEditar.tiempo_descanso.value = ej.tiempo_descanso;
    formEditar.unidad_descanso.value = ej.unidad_descanso_ejercicio;
    formEditar.descripcion.value = ej.descripcion ?? "";
    modalEditar.showModal();
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

const GetMusculos = async (ruta) => {
    const respuesta = await fetch(ruta).then( res => res.json());
    return respuesta.data;
}