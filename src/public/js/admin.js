// Obtén todos los formularios de eliminación usando su clase
const deleteForms = document.querySelectorAll('.deleteForm');

// Añade un evento de submit a cada formulario
deleteForms.forEach(form => {
    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evita el envío del formulario por defecto

        // Obtén el ID del usuario desde el atributo data-id del formulario
        const userId = form.dataset.id;
        console.log(userId)

        try {
            // Realiza la solicitud DELETE
            const response = await fetch(`/api/users/user/${userId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${document.cookie.split('=')[1]}` // Asumiendo que el JWT está almacenado en una cookie
                },
            });

            // Maneja la respuesta de la solicitud
            if (response.ok) { // Si la respuesta es 2xx
                alert("Usuario eliminado.")
                window.location.href = "/api/users/admin/users"; // Redirige a la página deseada
            } else {
                console.error("Error en la solicitud: ", response.status);
                alert("Se produjo un error al eliminar el usuario.");
            }
        } catch (error) {
            console.error("Error en la solicitud: ", error);
            alert("Hubo un problema al eliminar el usuario.");
        }
    });
});
