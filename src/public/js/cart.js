document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('.add-to-cart-form');
    forms.forEach(form => {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const cartId = form.dataset.cartId;
            const productId = form.dataset.productId;

            const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${document.cookie.split('=')[1]}` // Assuming the JWT is stored in a cookie
                }
            });

            if (response.ok) {
                window.location.href = `/api/views/carts/${cartId}`;
            } else {
                // Manejar el error si es necesario
                console.error('Error al agregar el producto al carrito');
            }
        });
    });
});
