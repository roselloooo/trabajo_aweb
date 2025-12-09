document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.cart-items');
    const subtotalEl = document.getElementById('cartSubtotal');
    const totalEl = document.getElementById('cartTotal');

    // Recuperamos lo guardado
    let cart = JSON.parse(localStorage.getItem('f1Cart')) || [];

    // Limpiamos el HTML
    container.innerHTML = '';
    let totalPrice = 0;

    if (cart.length === 0) {
        container.innerHTML = "<p style='text-align:center'>Tu carrito está vacío.</p>";
    } else {
        cart.forEach((item, index) => {
            // Calcular precio total del item
            const unitPrice = parseFloat(item.price.replace('€', '').trim());
            const itemTotal = unitPrice * item.qty;
            totalPrice += itemTotal;

            // HTML del item (CON TU FOTO)
            container.innerHTML += `
                <div class="cart-item">
                    <img src="${item.img}" alt="${item.title}" class="cart-img">
                    <div class="cart-details">
                        <h3>${item.title}</h3>
                        <p>Cantidad: ${item.qty}</p>
                    </div>
                    <div class="cart-right">
                        <p class="cart-price">€ ${itemTotal.toFixed(2)}</p>
                        <button onclick="removeItem(${index})" class="delete-btn">Eliminar</button>
                    </div>
                </div>
            `;
        });
    }

    // Totales
    subtotalEl.innerText = "€ " + totalPrice.toFixed(2);
    totalEl.innerText = "€ " + (totalPrice + 15).toFixed(2); // +15 envío
});

function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem('f1Cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('f1Cart', JSON.stringify(cart));
    location.reload(); // Recargar para ver cambios
}