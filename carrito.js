// carrito.js

document.addEventListener('DOMContentLoaded', () => {
    updateCartTotal();
});

function updateCartTotal() {
    let subtotal = 0;
    const shipping = 15.00;

    // Seleccionamos todos los items del carrito
    const items = document.querySelectorAll('.cart-item');

    items.forEach(item => {
        // Obtenemos el precio base
        const priceElement = item.querySelector('.cart-price');
        const price = parseFloat(priceElement.getAttribute('data-price'));
        
        // Obtenemos la cantidad
        const qtyInput = item.querySelector('input[type="number"]');
        const qty = parseInt(qtyInput.value);

        // Sumamos al subtotal
        subtotal += (price * qty);
    });

    // Actualizamos el HTML
    const total = subtotal + shipping;

    // Si no hay items, el total es 0
    if (items.length === 0) {
        document.getElementById('cartSubtotal').textContent = "€ 0.00";
        document.getElementById('cartTotal').textContent = "€ 0.00";
    } else {
        document.getElementById('cartSubtotal').textContent = "€ " + subtotal.toFixed(2);
        document.getElementById('cartTotal').textContent = "€ " + total.toFixed(2);
    }
}

function removeItem(itemId) {
    const item = document.getElementById(itemId);
    if (item) {
        // Animación simple para eliminar
        item.style.opacity = '0';
        setTimeout(() => {
            item.remove();
            updateCartTotal(); // Recalcular precio
            
            // Si nos quedamos sin productos
            if (document.querySelectorAll('.cart-item').length === 0) {
                alert("Tu carrito está vacío. Volviendo a la tienda.");
                window.location.href = 'catalogo.html';
            }
        }, 300);
    }
}