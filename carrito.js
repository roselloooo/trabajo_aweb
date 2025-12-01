document.addEventListener('DOMContentLoaded', () => {
    renderCart();
});

function renderCart() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const subtotalEl = document.getElementById('cartSubtotal');
    const totalEl = document.getElementById('cartTotal');
    
    // Leemos la memoria
    let cart = JSON.parse(localStorage.getItem('f1Cart')) || [];
    
    // Limpiamos el contenedor (borramos los ejemplos falsos)
    cartItemsContainer.innerHTML = '';

    let subtotal = 0;
    const shipping = 15.00;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align:center; padding:20px;">Tu carrito está vacío 🏎️💨</p>';
        subtotalEl.textContent = "€ 0.00";
        totalEl.textContent = "€ 0.00";
        return;
    }

    // Creamos el HTML para cada producto guardado
    cart.forEach((item, index) => {
        // Limpiamos precio para calcular
        const priceNum = parseFloat(item.price.replace('€', '').trim());
        const itemTotal = priceNum * item.qty;
        subtotal += itemTotal;

        const html = `
            <div class="cart-item">
                <img src="${item.img}" alt="${item.title}" class="cart-img">
                <div class="cart-details">
                    <h3>${item.title}</h3>
                    <p class="cart-meta">Cantidad: ${item.qty}</p>
                </div>
                <div class="cart-right">
                    <p class="cart-price">€ ${itemTotal.toFixed(2)}</p>
                    <button class="delete-btn" onclick="removeFromCart(${index})"><i class="fas fa-trash"></i> Eliminar</button>
                </div>
            </div>
        `;
        cartItemsContainer.innerHTML += html;
    });

    // Actualizamos totales
    subtotalEl.textContent = "€ " + subtotal.toFixed(2);
    totalEl.textContent = "€ " + (subtotal + shipping).toFixed(2);
}

function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('f1Cart')) || [];
    cart.splice(index, 1); // Quitar elemento
    localStorage.setItem('f1Cart', JSON.stringify(cart)); // Guardar cambios
    renderCart(); // Volver a pintar
}