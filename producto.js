document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. BASE DE DATOS DE PRODUCTOS (SIMULADA) ---
    // Aquí definimos los detalles de cada ID que pusimos en el catálogo
    const productsDB = {
        // FERRARI
        "fer-lec-jacket": { title: "Chaqueta Leclerc Fila 2025", price: 189.99, cat: "Ropa Premium", img: "https://i.ibb.co/VMyh0V8/leclerc-jacket.webp" },
        "fer-ham-cap": { title: "Gorra Lewis Hamilton Ferrari #44", price: 55.00, cat: "Accesorios", img: "https://i.ibb.co/X3YvL2g/ferrari-hamilton-cap.webp" },
        "fer-polo": { title: "Polo Oficial Scuderia Ferrari", price: 95.00, cat: "Ropa de Equipo", img: "https://i.ibb.co/F1Y2Z9R/ferrari-polo.webp" },
        "fer-lec-shirt": { title: "Camiseta Charles Leclerc Mónaco", price: 75.00, cat: "Ropa de Piloto", img: "https://via.placeholder.com/600/E10600/FFFFFF?text=Camiseta+Leclerc" },
        
        // ASTON MARTIN
        "am-alo-cap": { title: "Gorra Kimoa Fernando Alonso 2025", price: 50.00, cat: "Accesorios", img: "https://via.placeholder.com/600/005C4F/CAFF70?text=Gorra+Alonso+14" },
        "am-alo-shirt": { title: "Camiseta Fernando Alonso AMF1", price: 70.00, cat: "Ropa de Piloto", img: "https://via.placeholder.com/600/005C4F/FFFFFF?text=Camiseta+Alonso" },
        "am-jacket": { title: "Chaqueta Softshell Aston Martin", price: 150.00, cat: "Ropa de Equipo", img: "https://via.placeholder.com/600/005C4F/000000?text=Chaqueta+AM" },

        // RED BULL
        "rbr-ver-cap": { title: "Gorra Max Verstappen World Champ", price: 50.00, cat: "Accesorios", img: "https://i.ibb.co/xY9xR7X/redbull-cap.webp" },
        "rbr-tsu-shirt": { title: "Camiseta Yuki Tsunoda RBR", price: 75.00, cat: "Ropa de Piloto", img: "https://i.ibb.co/5cQ3W9n/verstappen-shirt.webp" },
        "rbr-model": { title: "Modelo RB21 Verstappen (1:18)", price: 140.00, cat: "Coleccionables", img: "https://via.placeholder.com/600/000044/FFFFFF?text=RB21+Model" },

        // MERCEDES
        "antonelli-helmet": { title: "Casco Kimi Antonelli Debut", price: 480.00, cat: "Coleccionables", img: "https://i.ibb.co/L5hYh81/helmet-main.webp" },
        "mer-rus-hoodie": { title: "Sudadera George Russell 63", price: 115.00, cat: "Ropa de Piloto", img: "https://i.ibb.co/7Kz1D7N/mercedes-hoodie.webp" },
        "mer-tshirt": { title: "Camiseta Mercedes-AMG Team", price: 80.00, cat: "Ropa de Equipo", img: "https://i.ibb.co/3s8J7Fp/mercedes-tshirt.webp" },

        // McLAREN
        "mcl-nor-cap": { title: "Gorra Lando Norris Neón", price: 45.00, cat: "Accesorios", img: "https://via.placeholder.com/600/CCFF00/000000?text=Gorra+Neon+Lando" },
        "mcl-pia-shirt": { title: "Camiseta Oscar Piastri #81", price: 75.00, cat: "Ropa de Piloto", img: "https://via.placeholder.com/600/000000/FF8700?text=Camiseta+Piastri" },

        // WILLIAMS
        "wil-sai-shirt": { title: "Camiseta Carlos Sainz Williams", price: 70.00, cat: "Ropa de Piloto", img: "https://i.ibb.co/f4Z6D8p/williams-sainz-tshirt.webp" },
        "wil-alb-cap": { title: "Gorra Alex Albon Williams", price: 45.00, cat: "Accesorios", img: "https://i.ibb.co/n1b2H7Q/albon-cap.webp" },

        // EXTRAS (Para cubrir el resto)
        "default": { title: "Producto Oficial F1 2025", price: 50.00, cat: "General", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/F1.svg/1200px-F1.svg.png" }
    };

    // --- 2. LEER LA URL ---
    // Esto obtiene el "?product=fer-lec-jacket" de la barra de direcciones
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('product');

    // --- 3. CARGAR DATOS ---
    const product = productsDB[productId] || productsDB["default"]; // Si no existe, carga el default

    // Si el producto no está en la base de datos exacta, intentamos generar un nombre bonito del ID
    // Esto sirve para los productos del catálogo inmenso que no puse arriba uno por uno
    if (!productsDB[productId] && productId) {
        product.title = formatTitleFromId(productId);
        product.img = "https://via.placeholder.com/600/333/FFF?text=" + product.title.split(' ').join('+');
        product.price = 65.00; // Precio genérico
    }

    // Actualizar el HTML
    document.getElementById('productTitle').textContent = product.title;
    document.getElementById('productCategory').textContent = product.cat;
    document.getElementById('basePrice').textContent = "€ " + product.price.toFixed(2);
    document.getElementById('mainImage').src = product.img;
    
    // --- 4. LÓGICA DE PRECIO DINÁMICO ---
    const quantityInput = document.getElementById('quantityInput');
    const subtotalDisplay = document.getElementById('subtotalPrice');

    function updatePrice() {
        const qty = parseInt(quantityInput.value);
        if(qty < 1) quantityInput.value = 1;
        const total = qty * product.price;
        subtotalDisplay.textContent = "€ " + total.toFixed(2);
    }

    quantityInput.addEventListener('input', updatePrice);
    updatePrice(); // Ejecutar al inicio

});

// Función auxiliar para crear nombres si faltan en la DB (Ej: "am-alo-flag" -> "Am Alo Flag")
function formatTitleFromId(id) {
    return id.replace(/-/g, ' ').toUpperCase() + " (Oficial 2025)";
}

// Función global para el botón
function addToCart() {
    const qty = document.getElementById('quantityInput').value;
    const title = document.getElementById('productTitle').textContent;
    alert(`¡Añadido al carrito!\n\nProducto: ${title}\nCantidad: ${qty}`);
}