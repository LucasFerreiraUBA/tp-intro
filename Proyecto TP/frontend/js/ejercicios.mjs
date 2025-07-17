export const crearModal = (ej,id_grupo_muscular,tablaEjercicios) => {
    const dialog = document.createElement("dialog");
    dialog.classList.add("modal-editar");

    const form = document.createElement("form");

    const titulo = document.createElement("h2");
    titulo.classList.add("title", "is-4");
    titulo.innerText = "Editar ejercicio";
    form.appendChild(titulo);

    // Función auxiliar para crear campos
    const crearCampo = (labelText, name, value, type = "text") => {
        const field = document.createElement("div");
        field.className = "field";

        const label = document.createElement("label");
        label.className = "label";
        label.innerText = labelText;

        const control = document.createElement("div");
        control.className = "control";

        const input = document.createElement("input");
        input.className = "input";
        input.name = name;
        input.value = value ?? "";
        input.type = type;

        control.appendChild(input);
        field.appendChild(label);
        field.appendChild(control);
        form.appendChild(field);
    };

    crearCampo("Grupo muscular", "grupo_muscular", ej.grupo_muscular);
    crearCampo("Ejercicio", "ejercicio", ej.ejercicio);
    crearCampo("Series", "series", ej.series, "number");
    crearCampo("Repeticiones", "repeticiones", ej.repeticiones, "number");
    crearCampo("Peso (kg)", "peso", ej.peso, "number");
    crearCampo("RIR", "rir", ej.rir, "number");
    crearCampo("Tiempo de descanso (min)", "tiempo_descanso", ej.tiempo_descanso, "number");

    // Textarea para descripción
    const fieldDesc = document.createElement("div");
    fieldDesc.className = "field";

    const labelDesc = document.createElement("label");
    labelDesc.className = "label";
    labelDesc.innerText = "Descripción";

    const controlDesc = document.createElement("div");
    controlDesc.className = "control";

    const textarea = document.createElement("textarea");
    textarea.className = "textarea";
    textarea.name = "descripcion";
    textarea.value = ej.descripcion ?? "";

    controlDesc.appendChild(textarea);
    fieldDesc.appendChild(labelDesc);
    fieldDesc.appendChild(controlDesc);
    form.appendChild(fieldDesc);

    // Botones
    const botones = document.createElement("div");
    botones.className = "field is-grouped";

    const btnGuardar = document.createElement("button");
    btnGuardar.type = "submit";
    btnGuardar.className = "button is-success";
    btnGuardar.innerText = "Guardar";

    const btnCancelar = document.createElement("button");
    btnCancelar.type = "button";
    btnCancelar.className = "button is-light";
    btnCancelar.innerText = "Cancelar";

    btnCancelar.addEventListener("click", () => {
        dialog.close();
        dialog.remove();
    });

    botones.appendChild(btnGuardar);
    botones.appendChild(btnCancelar);
    form.appendChild(botones);

    // Evento PATCH
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const datosActualizados = {
            ejercicio: form.ejercicio.value,
            grupo_muscular_id: parseInt(id_grupo_muscular),
            series: parseInt(form.series.value),
            repeticiones: parseInt(form.repeticiones.value),
            peso: parseFloat(form.peso.value),
            rir: parseInt(form.rir.value),
            tiempo_descanso: parseFloat(form.tiempo_descanso.value),
            descripcion: form.descripcion.value
        };

        try {
            const resp = await fetch(`http://localhost:3000/api/ejercicios/${ej.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datosActualizados)
            });

            if (resp.ok) {
                dialog.close();
                dialog.remove();
                tablaEjercicios();
                alert("Ejercicio actualizado con éxito");
            } else {
                alert("Error al actualizar el ejercicio");
            }
        } catch (err) {
            console.error("Error PATCH:", err);
            alert("Error al conectar con el servidor");
        }
    });

    dialog.appendChild(form);
    document.body.appendChild(dialog);
    dialog.showModal();
};
