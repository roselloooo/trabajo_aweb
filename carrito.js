document.addEventListener('DOMContentLoaded', () => {
    
    // 1. CARGAR PRODUCTOS DEL CARRITO
    const cartContainer = document.getElementById('cart-items');
    const totalElement = document.getElementById('cart-total');
    let cart = JSON.parse(localStorage.getItem('f1Cart')) || [];

    // Función para calcular y mostrar el total
    function updateCartTotal() {
        let total = 0;
        cart.forEach(item => {
            // Limpiamos el precio de símbolos como '€' y comas
            let priceNum = parseFloat(item.price.replace('€', '').replace(' ', '').replace(',', '.'));
            // Si el precio viene ya calculado por cantidad (ej: subtotal), lo sumamos directo
            // Si queremos ser precisos, mejor recalculamos: precio unitario * cantidad.
            // Para simplificar, asumimos que item.price ya es el subtotal correcto del producto.
            if(!isNaN(priceNum)) {
                total += priceNum;
            }
        });
        
        if(totalElement) {
            totalElement.innerText = total.toFixed(2) + "€";
        }
        return total.toFixed(2) + "€";
    }

    // 2. DIBUJAR LOS PRODUCTOS
    if (cart.length === 0) {
        cartContainer.innerHTML = '<p style="text-align:center; padding: 20px;">Tu carrito está vacío 🏎️💨</p>';
    } else {
        cartContainer.innerHTML = ''; // Limpiar
        
        cart.forEach((product, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('cart-item'); // Asegúrate de tener estilos para esto en CSS
            itemDiv.style.borderBottom = "1px solid #ccc";
            itemDiv.style.padding = "10px";
            itemDiv.style.display = "flex";
            itemDiv.style.justifyContent = "space-between";
            itemDiv.style.alignItems = "center";

            itemDiv.innerHTML = `
                <div style="display:flex; align-items:center; gap: 15px;">
                    <img src="${product.img}" alt="${product.title}" style="width: 60px; height: 60px; object-fit: contain;">
                    <div>
                        <h4 style="margin: 0;">${product.title}</h4>
                        <p style="margin: 5px 0; font-size: 0.9em; color: #555;">${product.variant || ''}</p>
                        <p style="margin: 0; font-weight: bold;">Cant: ${product.qty}</p>
                    </div>
                </div>
                <div style="text-align: right;">
                    <p style="font-weight: bold; font-size: 1.1em; color: var(--f1-red);">${product.price}</p>
                    <button class="remove-btn" data-index="${index}" style="color: red; background: none; border: none; cursor: pointer; text-decoration: underline;">Eliminar</button>
                </div>
            `;
            cartContainer.appendChild(itemDiv);
        });

        // Eventos para eliminar productos
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                cart.splice(index, 1); // Quitar del array
                localStorage.setItem('f1Cart', JSON.stringify(cart)); // Guardar cambios
                location.reload(); // Recargar página para ver cambios
            });
        });
    }

    // Calculamos el total inicial
    updateCartTotal();

    // 3. BOTÓN DE PAGAR (AQUÍ ESTÁ LA CLAVE DEL PRECIO)
    // Busca el botón por ID 'checkout-btn' o la clase '.checkout-btn'
    const checkoutBtn = document.getElementById('checkout-btn') || document.querySelector('.checkout-btn');
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Evitamos saltar inmediatamente

            // Si el carrito está vacío, no dejamos pagar
            if (cart.length === 0) {
                alert("El carrito está vacío.");
                return;
            }

            // Recogemos el valor actual del total
            const precioFinal = document.getElementById('cart-total').innerText;

            // --- GUARDAMOS EL PRECIO EN MEMORIA ---
            localStorage.setItem('f1TotalPagar', precioFinal);
            
            console.log("Precio guardado:", precioFinal);

            // Nos vamos a la página de pago
            window.location.href = 'pago.html';
        });
    }
});