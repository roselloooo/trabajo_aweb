document.addEventListener('DOMContentLoaded', () => {
    
    // Leemos los parámetros de la URL (lo que envió catalogo.js)
    const params = new URLSearchParams(window.location.search);
    
    const title = params.get('title');
    const img = params.get('img'); // <--- Aquí llega tu foto
    const price = params.get('price');
    const cat = params.get('cat');

    // Referencias a los elementos del HTML
    const titleEl = document.getElementById('productTitle');
    const imgEl = document.getElementById('mainImage');
    const priceEl = document.getElementById('basePrice');
    const subtotalEl = document.getElementById('subtotalPrice');
    const catEl = document.getElementById('productCategory');
    const qtyInput = document.getElementById('quantityInput');

    // Si tenemos datos, rellenamos la página
    if (title && imgEl) {
        titleEl.innerText = title;
        imgEl.src = decodeURIComponent(img); // <--- PONEMOS TU FOTO AQUÍ
        priceEl.innerText = price;
        subtotalEl.innerText = price;
        catEl.innerText = cat;
    }

    // Lógica de cantidad x precio
    if (qtyInput && price) {
        // Quitamos el símbolo € y comas para calcular
        const priceNum = parseFloat(price.replace('€', '').replace(',', '.').trim());
        
        qtyInput.addEventListener('input', () => {
            let qty = parseInt(qtyInput.value);
            if (qty < 1 || isNaN(qty)) qty = 1;
            const total = (qty * priceNum).toFixed(2);
            subtotalEl.innerText = "€ " + total;
        });
    }
});

// Función para AÑADIR AL CARRITO (Guardando TU foto)
function addToCart() {
    const product = {
        title: document.getElementById('productTitle').innerText,
        price: document.getElementById('basePrice').innerText,
        img: document.getElementById('mainImage').src, // <--- GUARDAMOS TU FOTO
        qty: document.getElementById('quantityInput').value
    };

    // Guardar en el navegador
    let cart = JSON.parse(localStorage.getItem('f1Cart')) || [];
    cart.push(product);
    localStorage.setItem('f1Cart', JSON.stringify(cart));

    alert("Producto añadido al carrito correctamente 🏎️");
    window.location.href = 'carrito.html';
}