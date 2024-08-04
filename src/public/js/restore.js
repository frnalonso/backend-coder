const form = document.getElementById('restoreForm');

form.addEventListener('submit', async e => {
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => obj[key] = value);
    
    // Obtener el token de la URL actual
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    console.log(token)

    // Incluir el token en la URL de la solicitud POST
    try {
        const response = await fetch(`/api/users/restore?token=${token}`, {
            method: "POST",
            body: JSON.stringify(obj),
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.status === 201) {
            alert("Exitoso el cambio de clave. Presiona Aceptar para volver al inicio de sesión.");
            window.location.href = '/api/views/login';
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.message}`);
            console.log("Algo ha salido inesperado.");
        }
    } catch (error) {
        console.error("Error:", error);
    }
});
