document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('.realizar-compra');
    forms.forEach(form => {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const cartId = form.dataset.cartId;
            const response = await fetch(`/api/carts/${cartId}/purchase`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${document.cookie.split('=')[1]}` // Assuming the JWT is stored in a cookie
                }
            });

            const result = await response.json();

            if (response.ok) {
                // Mostrar el ticket en una alerta
                alert(`Compra realizada con éxito. Ticket: ${JSON.stringify(result.ticket)}`);

                // Redirigir al usuario
                window.location.href = `/api/views/carts/${cartId}`;
            } else {
                // Manejar el error si es necesario
                console.error('Error al realizar la compra del carrito.');
            }
        });
    });
});
