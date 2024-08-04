console.log("sskjsoks")
const form = document.getElementById('forgotPasswordForm');

form.addEventListener('submit', e => {
    e.preventDefault();

    const data = new FormData(form);
    const obj = {};

    data.forEach((value, key) => obj[key] = value);

    fetch('/api/users/reset-password', {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then(response => {
        if (response.status === 200) {
            console.log("Enlace de restablecimiento enviado exitosamente.");
            alert("Enlace de restablecimiento enviado a tu correo electrónico.");
        } else {
            console.log("Ocurrió un error al enviar el enlace.");
            alert("Ocurrió un error. Por favor, intenta nuevamente.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Ocurrió un error inesperado.");
    });
});

