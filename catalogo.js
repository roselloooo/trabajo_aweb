document.addEventListener('DOMContentLoaded', () => {
    
    const searchInput = document.getElementById('searchInput');
    const originalContent = document.getElementById('originalContent');
    const searchResults = document.getElementById('searchResults');
    const allProductCards = document.querySelectorAll('.product-card');
    const teamHeaders = document.querySelectorAll('.team-heading');
    
    // ELEMENTOS DE LA BARRA DE FILTROS
    const priceSortSelect = document.getElementById('priceSort');
    const stockFilterCheckbox = document.getElementById('stockFilter');
    
    // Variable para recordar en qué categoría estamos (por defecto 'all')
    let currentCategory = 'all';

    // CONFIGURACIÓN DE PILOTOS (Para cuando pulsas "Pilotos")
    const driverNames = {
        'ferrari': "Charles Leclerc / Lewis Hamilton",
        'aston-martin': "Fernando Alonso / Lance Stroll",
        'red-bull': "Max Verstappen / Yuki Tsunoda",
        'mercedes': "George Russell / Kimi Antonelli",
        'mclaren': "Lando Norris / Oscar Piastri",
        'williams': "Carlos Sainz / Alex Albon",
        'alpine': "Pierre Gasly / Jack Doohan",
        'racing-bulls': "Liam Lawson / Isack Hadjar",
        'sauber': "Nico Hülkenberg / Gabriel Bortoleto",
        'haas': "Esteban Ocon / Oliver Bearman"
    };

    // GUARDAR TÍTULOS ORIGINALES DE LOS EQUIPOS
    teamHeaders.forEach(h2 => {
        if (!h2.getAttribute('data-original-html')) {
            h2.setAttribute('data-original-html', h2.innerHTML);
        }
    });

    // --- 1. EVENTOS (ESCUCHAR CLICS) ---
    
    // Si cambias el precio...
    if (priceSortSelect) {
        priceSortSelect.addEventListener('change', () => {
            filterProducts(currentCategory); // Re-ordenamos lo que se esté viendo
        });
    }

    // Si marcas la casilla de stock...
    if (stockFilterCheckbox) {
        stockFilterCheckbox.addEventListener('change', () => {
            filterProducts(currentCategory); // Re-filtramos lo que se esté viendo
        });
    }

    // --- 2. LA GRAN FUNCIÓN DE FILTRADO ---
    window.filterProducts = function(category) {
        currentCategory = category; // Recordamos la categoría

        if(searchInput) searchInput.value = "";
        originalContent.style.display = 'block';
        searchResults.style.display = 'none';

        // Gestión visual de los botones de arriba (Negrita/Rojo)
        const buttons = document.querySelectorAll('.tag');
        buttons.forEach(btn => {
            if (category === 'Equipos' || category === 'Pilotos') {
                btn.classList.remove('active');
            } else {
                btn.classList.toggle('active', btn.innerText.trim() === (category === 'all' ? 'Todos' : category));
            }
        });

        // Cambio de Títulos (Modo Pilotos vs Modo Equipos)
        teamHeaders.forEach(h2 => {
            if (category === 'Pilotos') {
                let newTitle = null;
                for (const [teamClass, names] of Object.entries(driverNames)) {
                    if (h2.classList.contains(teamClass)) {
                        newTitle = names;
                        break;
                    }
                }
                if (newTitle) {
                    const img = h2.querySelector('img');
                    if (img) {
                        h2.innerHTML = ''; h2.appendChild(img); h2.append(" " + newTitle);
                    } else {
                        h2.innerText = newTitle;
                    }
                }
            } else {
                // Restaurar nombre original
                h2.innerHTML = h2.getAttribute('data-original-html');
            }
        });

        // --- FILTRADO DE TARJETAS ---
        const activeCards = []; // Aquí guardaremos las cartas visibles para ordenarlas luego

        allProductCards.forEach(card => {
            const text = card.textContent.toLowerCase();
            const categoryTag = card.querySelector('.card-category') ? card.querySelector('.card-category').innerText.toLowerCase() : "";
            const btn = card.querySelector('button'); // El botón de comprar

            // A. CHECK DE CATEGORÍA
            let matchesCategory = false;
            if (category === 'all') matchesCategory = true;
            else if (category === 'Ropa') {
                if (text.includes('ropa') || text.includes('camiseta') || text.includes('sudadera') || text.includes('chaqueta') || text.includes('polo')) matchesCategory = true;
            } 
            else if (category === 'Accesorios') {
                if (text.includes('accesorios') || text.includes('gorra') || text.includes('mochila') || text.includes('taza')) matchesCategory = true;
            } 
            else if (category === 'Coleccionables') {
                if (text.includes('coleccionables') || text.includes('modelo') || text.includes('casco')) matchesCategory = true;
            }
            else if (category === 'Pilotos') {
                if (categoryTag.includes('piloto') || text.includes('alonso') || text.includes('sainz') || text.includes('verstappen') || text.includes('hamilton') || text.includes('leclerc')) matchesCategory = true;
            }
            else if (category === 'Equipos') {
                if (categoryTag.includes('equipo') || text.includes('team') || text.includes('oficial') || text.includes('polo')) matchesCategory = true;
            }

            // B. CHECK DE STOCK (LA NOVEDAD)
            let matchesStock = true;
            if (stockFilterCheckbox && stockFilterCheckbox.checked) {
                // Si el botón está desactivado O dice "Agotado", es que no hay stock
                const isSoldOut = btn && (btn.disabled || btn.innerText.toLowerCase().includes('agotado'));
                if (isSoldOut) {
                    matchesStock = false; // Lo ocultamos
                }
            }

            // C. APLICAR VISIBILIDAD
            if (matchesCategory && matchesStock) {
                card.style.display = 'flex';
                card.parentElement.style.display = 'grid'; 
                activeCards.push(card);
            } else {
                card.style.display = 'none';
            }
        });

        // --- ORDENAR POR PRECIO ---
        if (priceSortSelect && priceSortSelect.value !== 'default') {
            const order = priceSortSelect.value;
            
            // Ordenamos el array temporal
            activeCards.sort((a, b) => {
                // Limpiamos el precio (quitamos € y cambiamos coma por punto)
                const priceA = parseFloat(a.querySelector('.card-price').innerText.replace('€', '').replace(',', '.'));
                const priceB = parseFloat(b.querySelector('.card-price').innerText.replace('€', '').replace(',', '.'));
                
                if (order === 'asc') return priceA - priceB;
                if (order === 'desc') return priceB - priceA;
                return 0;
            });

            // Reorganizamos en el HTML
            activeCards.forEach(card => {
                card.parentElement.appendChild(card);
            });
        }

        // Limpiar secciones vacías (para que no se vean títulos de equipo sin productos)
        const teamSections = document.querySelectorAll('.product-list');
        teamSections.forEach(list => {
            const visibleChildren = Array.from(list.children).filter(c => c.style.display !== 'none').length;
            const title = list.previousElementSibling;
            
            if (visibleChildren > 0) {
                list.style.display = 'grid';
                if(title) title.style.display = 'block';
            } else {
                list.style.display = 'none';
                if(title) title.style.display = 'none';
            }
        });
    };

    // --- 3. BUSCADOR (Mantenemos tu lógica) ---
    if (searchInput) {
        searchInput.addEventListener('keyup', (e) => {
            const term = e.target.value.toLowerCase().trim();
            if (term.length > 0) {
                originalContent.style.display = 'none';
                searchResults.style.display = 'grid';
                searchResults.innerHTML = ''; 
                let encontrados = 0;
                allProductCards.forEach(card => {
                    const content = card.textContent.toLowerCase();
                    if (content.includes(term)) {
                        const clone = card.cloneNode(true);
                        clone.style.display = 'flex';
                        searchResults.appendChild(clone);
                        encontrados++;
                    }
                });
                if (encontrados === 0) searchResults.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: white;">Sin resultados 🏎️</p>`;
            } else {
                originalContent.style.display = 'block';
                searchResults.style.display = 'none';
                filterProducts(currentCategory); 
            }
        });
    }

    // --- 4. CLIC EN PRODUCTO (Ir al detalle) ---
    document.addEventListener('click', function(e) {
        const card = e.target.closest('.product-card');
        
        // ¡IMPORTANTE! Si está agotado (disabled), no dejamos clicar
        if (card && card.querySelector('button') && card.querySelector('button').disabled) return; 

        if (card && !e.target.closest('button')) { 
            const pid = card.getAttribute('data-product-id');
            const imgElement = card.querySelector('img');
            if (!pid || !imgElement) return;
            
            const imgSrc = imgElement.src; 
            const title = card.querySelector('h2').innerText;
            const price = card.querySelector('.card-price').innerText;
            let category = "Producto F1";
            const catElem = card.querySelector('.card-category');
            if (catElem) category = catElem.innerText;
            
            const url = `index.html?id=${pid}&img=${encodeURIComponent(imgSrc)}&title=${encodeURIComponent(title)}&price=${encodeURIComponent(price)}&cat=${encodeURIComponent(category)}`;
            window.location.href = url;
        }
    });
});