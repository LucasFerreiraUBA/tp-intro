export const PatchOneById = async (url, data) => {
    try {
        console.log("Enviando:", data);
        const respuesta = await fetch(url, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!respuesta.ok) {
            const errorText = await respuesta.text();
            throw new Error(`Error del servidor: ${respuesta.status} - ${errorText}`);
        }

        return respuesta
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
};
