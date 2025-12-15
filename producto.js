let currentProductId = null;
let currentStock = 0;

document.addEventListener('DOMContentLoaded', () => {

    const DB_URL = 'datos.json';
    let productsDB = {};

    fetch(DB_URL)
        .then(response => {
            if (!response.ok) throw new Error("Error 404");
            return response.json();
        })
        .then(data => {
            data.forEach(item => productsDB[item.id] = item);
            
            const params = new URLSearchParams(window.location.search);
            currentProductId = params.get('id'); 
            
            // ELEMENTOS A MODIFICAR
            const stockMsg = document.getElementById('stockDisplay');
            const addToCartBtn = document.querySelector('.add-to-cart-btn'); // Botón Carrito
            const buyNowBtn = document.querySelector('.buy-now-btn');       // Botón Comprar Ahora (Link)

            if (currentProductId && productsDB[currentProductId]) {
                
                // Lógica de memoria (LocalStorage)
                let stockOriginal = productsDB[currentProductId].stock;
                const stockGuardado = localStorage.getItem(`stock_${currentProductId}`);

                if (stockGuardado !== null) {
                    currentStock = parseInt(stockGuardado);
                } else {
                    currentStock = stockOriginal;
                }

                // --- LÓGICA DE VISUALIZACIÓN DE STOCK Y BLOQUEO ---
                if(stockMsg) {
                    if (currentStock <= 0) {
                        // === CASO AGOTADO (BLOQUEAR TODO) ===
                        stockMsg.innerText = `❌ AGOTADO (Sin stock)`;
                        stockMsg.style.color = "red";
                        
                        // 1. Bloquear botón de Carrito
                        addToCartBtn.disabled = true; 
                        addToCartBtn.innerText = "AGOTADO";
                        addToCartBtn.style.backgroundColor = "#555"; 
                        addToCartBtn.style.cursor = "not-allowed";

                        // 2. Bloquear botón de Comprar Ahora (El cambio nuevo)
                        buyNowBtn.innerText = "No Disponible";
                        buyNowBtn.style.backgroundColor = "#555";
                        buyNowBtn.style.pointerEvents = "none"; // Esto hace que no se pueda clicar
                        buyNowBtn.removeAttribute("href"); // Quitamos el enlace por seguridad

                    } else if (currentStock < 5) {
                        // === CASO POCAS UNIDADES ===
                        stockMsg.innerHTML = `🔥 <strong>¡Date prisa! Solo quedan ${currentStock} unidades</strong>`;
                        stockMsg.style.color = "#FF8C00"; 

                        // Reactivar botones
                        addToCartBtn.disabled = false;
                        addToCartBtn.innerHTML = '<i class="fas fa-shopping-cart"></i> Últimas Unidades';
                        addToCartBtn.style.backgroundColor = ""; 
                        
                        buyNowBtn.innerText = "Comprar Ahora";
                        buyNowBtn.style.backgroundColor = "";
                        buyNowBtn.style.pointerEvents = "auto";
                        buyNowBtn.setAttribute("href", "pago.html");

                    } else {
                        // === CASO STOCK NORMAL ===
                        stockMsg.innerText = `Stock disponible: ${currentStock} unidades`;
                        stockMsg.style.color = "#0090FF"; 
                        
                        // Reactivar botones
                        addToCartBtn.disabled = false;
                        addToCartBtn.innerHTML = '<i class="fas fa-shopping-cart"></i> Añadir al Carrito';
                        addToCartBtn.style.backgroundColor = ""; 
                        
                        buyNowBtn.innerText = "Comprar Ahora";
                        buyNowBtn.style.backgroundColor = "";
                        buyNowBtn.style.pointerEvents = "auto";
                        buyNowBtn.setAttribute("href", "pago.html");
                    }
                }
                
                configurarOpciones(params.get('cat'), params.get('title'), currentProductId);
            }
        })
        .catch(error => console.error("Error:", error));

    // Resto del código...
    const params = new URLSearchParams(window.location.search);
    const title = params.get('title');
    const img = params.get('img');
    const price = params.get('price');
    const cat = params.get('cat');

    const titleEl = document.getElementById('productTitle');
    
    if (titleEl && title) {
        titleEl.textContent = title;
        document.getElementById('productCategory').textContent = cat || 'Producto Oficial';
        if(img) document.getElementById('mainImage').src = decodeURIComponent(img);
        if(price) {
            document.getElementById('basePrice').textContent = price;
            document.getElementById('subtotalPrice').textContent = price;
        }
    }

    const qtyInput = document.getElementById('quantityInput');
    const subtotalDisplay = document.getElementById('subtotalPrice');
    
    if (qtyInput && price) {
        const priceNum = parseFloat(price.replace('€', '').replace(',', '.').trim());
        qtyInput.addEventListener('input', () => {
            let qty = parseInt(qtyInput.value);
            if (qty < 1 || isNaN(qty)) qty = 1;
            
            if (qty > currentStock) {
                qty = currentStock;
                qtyInput.value = currentStock;
                if(currentStock > 0) alert(`¡Solo quedan ${currentStock} unidades!`);
            }
            if (qty > 6) { qty = 6; qtyInput.value = 6; alert("Máximo 6 unidades"); }

            subtotalDisplay.textContent = "€ " + (qty * priceNum).toFixed(2);
        });
    }
});

function configurarOpciones(category, title, pid) {
    const container = document.getElementById('sizeSelector');
    if (!container) return;
    const label = container.querySelector('label');
    const select = container.querySelector('.select-box');
    const texto = (category + " " + title).toLowerCase();

    // ROPA
    if (texto.includes('ropa') || texto.includes('camiseta') || texto.includes('sudadera') || texto.includes('chaqueta') || texto.includes('polo')) {
        container.style.display = 'block'; label.textContent = "Talla:";
        
        let opcionesHTML = `<option>XS</option>`;

        if (pid === 'fer-lec-jacket') {
            opcionesHTML += `<option>S</option><option disabled style="color:red;">M (Agotada)</option><option>L</option><option>XL</option><option>XXL</option>`;
        } else if (pid === 'mer-rus-shirt') {
            opcionesHTML = `<option disabled style="color:red;">S (Agotada)</option><option>M</option><option disabled style="color:red;">L (Agotada)</option><option>XL</option><option>XXL</option>`;
        } else if (pid === 'mcl-nor-shirt') {
            opcionesHTML += `<option>S</option><option>M</option><option>L</option><option disabled style="color:red;">XL (Agotada)</option><option>XXL</option>`;
        } else {
            opcionesHTML += `<option>S</option><option selected>M</option><option>L</option><option>XL</option><option>XXL</option>`;
        }
        select.innerHTML = opcionesHTML;
    } 
    // GORRAS
    else if (texto.includes('gorra') || texto.includes('cap')) {
        container.style.display = 'block'; label.textContent = "Ajuste:";
        select.innerHTML = `<option>Talla Única</option>`;
    } 
    // COCHES
    else if (texto.includes('modelo') || texto.includes('coche') || texto.includes('1:43')) {
        container.style.display = 'block'; label.textContent = "Escala:";
        select.innerHTML = `<option selected>1:43</option><option>1:18 (+50€)</option>`;
        select.addEventListener('change', function() {
            const base = parseFloat(document.getElementById('basePrice').textContent.replace('€','')); 
            const qty = document.getElementById('quantityInput').value;
            let finalPrice = base; if(this.value.includes('+50')) finalPrice += 50;
            document.getElementById('subtotalPrice').textContent = "€ " + (finalPrice * qty).toFixed(2);
        });
    } 
    // BOTELLAS
    else if (texto.includes('botella') || texto.includes('taza')) {
        container.style.display = 'block'; label.textContent = "Capacidad:";
        select.innerHTML = `<option>500 ml</option>`;
    } else {
        container.style.display = 'none';
    }
}

function addToCart() {
    if (currentStock <= 0) {
        alert("Lo sentimos, este producto está agotado.");
        return;
    }

    const qtyInput = document.getElementById('quantityInput');
    const cantidadComprada = parseInt(qtyInput.value);
    let nuevoStock = currentStock - cantidadComprada;
    localStorage.setItem(`stock_${currentProductId}`, nuevoStock);

    const selector = document.getElementById('sizeSelector');
    let opcion = "Estándar";
    if (selector.style.display !== 'none') {
        const tipo = selector.querySelector('label').textContent.replace(':', '');
        const valor = selector.querySelector('.select-box').value;
        if(valor.includes('Agotada')) {
            alert("Esa talla está agotada.");
            return;
        }
        opcion = `${tipo}: ${valor}`;
    }

    const product = {
        title: document.getElementById('productTitle').textContent,
        price: document.getElementById('subtotalPrice').textContent,
        img: document.getElementById('mainImage').src,
        qty: cantidadComprada,
        variant: opcion
    };

    let cart = JSON.parse(localStorage.getItem('f1Cart')) || [];
    cart.push(product);
    localStorage.setItem('f1Cart', JSON.stringify(cart));

    alert(`¡Comprado! Quedan ${nuevoStock} unidades.`);
    window.location.href = 'carrito.html';
}