document.addEventListener('DOMContentLoaded', () => {

    // =========================================================
    // 1. LÓGICA DEL CATÁLOGO (Al hacer clic en un producto)
    // =========================================================
    const productCards = document.querySelectorAll('.product-card');
    
    if (productCards.length > 0) {
        
        // BUSCADOR (Mismo de antes, funciona perfecto)
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('keyup', (e) => {
                const term = e.target.value.toLowerCase();
                productCards.forEach(card => {
                    const content = card.textContent.toLowerCase();
                    const section = card.closest('.product-list').previousElementSibling; 
                    const teamName = section ? section.textContent.toLowerCase() : "";
                    
                    if (content.includes(term) || teamName.includes(term)) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        }

        // CLIC EN TARJETA: Aquí está la clave
        productCards.forEach(card => {
            card.addEventListener('click', () => {
                const pid = card.getAttribute('data-product-id');
                // LEEMOS LA FOTO DIRECTAMENTE DE TU HTML
                const imgElement = card.querySelector('img');
                const imgSrc = imgElement ? imgElement.src : ''; // Cogemos la URL real
                
                const title = card.querySelector('h2').textContent;
                const price = card.querySelector('.card-price').textContent;
                const category = card.querySelector('.card-category').textContent;

                // Enviamos todos estos datos a la siguiente página por la URL
                const url = `index.html?id=${pid}&img=${encodeURIComponent(imgSrc)}&title=${encodeURIComponent(title)}&price=${encodeURIComponent(price)}&cat=${encodeURIComponent(category)}`;
                
                window.open(url, '_blank'); // Abrir en nueva pestaña
            });
        });
    }

    // =========================================================
    // 2. LÓGICA DE PÁGINA DE DETALLE (index.html)
    // =========================================================
    const titleEl = document.getElementById('productTitle');
    
    if (titleEl) {
        // Recuperamos los datos de la URL
        const params = new URLSearchParams(window.location.search);
        
        const title = params.get('title');
        const img = params.get('img');
        const price = params.get('price');
        const cat = params.get('cat');

        // Si hay datos, rellenamos la página
        if (title) {
            titleEl.textContent = title;
            if(img) document.getElementById('mainImage').src = img; // Ponemos la foto real
            if(price) {
                document.getElementById('basePrice').textContent = price;
                document.getElementById('subtotalPrice').textContent = price;
            }
            if(cat) document.getElementById('productCategory').textContent = cat;
        }

        // Lógica de precio dinámico (Cantidad x Precio)
        const quantityInput = document.getElementById('quantityInput');
        const subtotalDisplay = document.getElementById('subtotalPrice');
        
        if (quantityInput && price) {
            // Quitamos el símbolo € para poder multiplicar
            const priceNum = parseFloat(price.replace('€', '').replace(',', '.').trim()); 
            
            quantityInput.addEventListener('input', () => {
                let qty = parseInt(quantityInput.value);
                if (qty < 1 || isNaN(qty)) qty = 1;
                const total = (qty * priceNum).toFixed(2);
                subtotalDisplay.textContent = "€ " + total;
            });
        }
    }
});

// =========================================================
// 3. FUNCIÓN AÑADIR AL CARRITO (Guarda la foto real)
// =========================================================
function addToCart() {
    // Recopilamos datos de la página actual
    const product = {
        id: new Date().getTime(), // ID único temporal
        title: document.getElementById('productTitle').textContent,
        price: document.getElementById('basePrice').textContent,
        img: document.getElementById('mainImage').src, // LA FOTO REAL
        qty: document.getElementById('quantityInput').value
    };

    // Guardamos en la "memoria" del navegador (LocalStorage)
    let cart = JSON.parse(localStorage.getItem('f1Cart')) || [];
    cart.push(product);
    localStorage.setItem('f1Cart', JSON.stringify(cart));

    alert("¡Producto añadido al carrito!");
    window.location.href = 'carrito.html'; // Vamos al carrito
}

// Filtros para el catálogo
function filterProducts(category) {
    const cards = document.querySelectorAll('.product-card');
    const buttons = document.querySelectorAll('.tag');

    buttons.forEach(btn => {
        if (btn.textContent.trim() === (category === 'all' ? 'Todos' : category)) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    cards.forEach(card => {
        const cardCat = card.querySelector('.card-category').textContent;
        if (category === 'all' || cardCat.includes(category)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}