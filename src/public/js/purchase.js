document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('.realizar-compra');
    forms.forEach(form => {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const cartId = form.dataset.cartId;
            console.log(form.dataset)
            console.log(cartId)
            const response = await fetch(`/api/carts/${cartId}/purchase`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${document.cookie.split('=')[1]}` // Assuming the JWT is stored in a cookie
                }
            });

            if (response.ok) {
                console.log("Compra concretada.");
                window.location.href = `/api/views/carts/${cartId}`;
            } else {
                // Manejar el error si es necesario
                console.error('Error al realizar la compra del carrito.');
            }
        });
    });
});
