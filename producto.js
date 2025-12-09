document.addEventListener('DOMContentLoaded', () => {

    // 1. LEER DATOS DE LA URL
    const params = new URLSearchParams(window.location.search);
    const title = params.get('title');
    const img = params.get('img');
    const price = params.get('price');
    const cat = params.get('cat');

    // 2. RELLENAR LA PÁGINA
    const titleEl = document.getElementById('productTitle');
    
    if (titleEl && title) {
        titleEl.textContent = title;
        document.getElementById('productCategory').textContent = cat || 'Producto Oficial';
        
        if(price) {
            document.getElementById('basePrice').textContent = price;
            document.getElementById('subtotalPrice').textContent = price;
        }
        
        if(img) {
            document.getElementById('mainImage').src = decodeURIComponent(img);
        }

        configurarOpciones(cat, title);
    }

    // --- 3. LÓGICA DE PRECIO Y LÍMITE DE CANTIDAD (CAMBIO AQUÍ) ---
    const qtyInput = document.getElementById('quantityInput');
    const subtotalDisplay = document.getElementById('subtotalPrice');
    
    if (qtyInput && price) {
        // Limpiamos el precio
        const priceNum = parseFloat(price.replace('€', '').replace(',', '.').trim());
        
        qtyInput.addEventListener('input', () => {
            let qty = parseInt(qtyInput.value);

            // VALIDACIÓN: Mínimo 1
            if (qty < 1 || isNaN(qty)) {
                qty = 1;
                qtyInput.value = 1;
            }
            
            // VALIDACIÓN: Máximo 6 (NUEVO)
            if (qty > 6) {
                qty = 6;
                qtyInput.value = 6; // Forzamos el valor a 6 visualmente
                alert("⚠️ Lo sentimos, el límite de compra es de 6 unidades por cliente.");
            }

            // Calculamos el total con la cantidad corregida
            subtotalDisplay.textContent = "€ " + (qty * priceNum).toFixed(2);
        });
    }
});

// Función Opciones (Igual que antes)
function configurarOpciones(category, title) {
    const container = document.getElementById('sizeSelector');
    if (!container) return;

    const label = container.querySelector('label');
    const select = container.querySelector('.select-box');
    const texto = (category + " " + title).toLowerCase();

    if (texto.includes('ropa') || texto.includes('camiseta') || texto.includes('sudadera') || texto.includes('chaqueta') || texto.includes('polo')) {
        container.style.display = 'block';
        label.textContent = "Talla:";
        select.innerHTML = `<option>XS</option><option>S</option><option selected>M</option><option>L</option><option>XL</option><option>XXL</option>`;
    }
    else if (texto.includes('gorra') || texto.includes('cap')) {
        container.style.display = 'block';
        label.textContent = "Ajuste:";
        select.innerHTML = `<option>Talla Única (Ajustable)</option>`;
    }
    else if (texto.includes('modelo') || texto.includes('coche') || texto.includes('1:43')) {
        container.style.display = 'block';
        label.textContent = "Escala:";
        select.innerHTML = `<option selected>1:43 (Estándar)</option><option>1:18 (Grande +50€)</option>`;
    }
    else if (texto.includes('botella') || texto.includes('taza') || texto.includes('mug')) {
        container.style.display = 'block';
        label.textContent = "Capacidad:";
        select.innerHTML = `<option>500 ml</option><option>750 ml</option>`;
    }
    else {
        container.style.display = 'none'; 
    }
}

// Función Añadir al Carrito (Igual que antes)
function addToCart() {
    const selector = document.getElementById('sizeSelector');
    let opcion = "Estándar";
    
    if (selector.style.display !== 'none') {
        const tipo = selector.querySelector('label').textContent.replace(':', '');
        const valor = selector.querySelector('.select-box').value;
        opcion = `${tipo}: ${valor}`;
    }

    const product = {
        title: document.getElementById('productTitle').textContent,
        price: document.getElementById('basePrice').textContent,
        img: document.getElementById('mainImage').src,
        qty: document.getElementById('quantityInput').value,
        variant: opcion
    };

    let cart = JSON.parse(localStorage.getItem('f1Cart')) || [];
    cart.push(product);
    localStorage.setItem('f1Cart', JSON.stringify(cart));

    alert("¡Producto añadido al carrito correctamente! 🏎️");
    window.location.href = 'carrito.html';
}