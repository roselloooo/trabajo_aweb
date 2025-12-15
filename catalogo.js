document.addEventListener('DOMContentLoaded', () => {
    
    const searchInput = document.getElementById('searchInput');
    const originalContent = document.getElementById('originalContent');
    const searchResults = document.getElementById('searchResults');
    // IMPORTANTE: Seleccionamos solo las cartas originales para no duplicar
    const allProductCards = document.querySelectorAll('#originalContent .product-card');
    const teamHeaders = document.querySelectorAll('.team-heading');
    
    const priceSortSelect = document.getElementById('priceSort');
    const stockFilterCheckbox = document.getElementById('stockFilter');
    
    let currentCategory = 'all';

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

    // GUARDAR TÍTULOS ORIGINALES
    teamHeaders.forEach(h2 => {
        if (!h2.getAttribute('data-original-html')) {
            h2.setAttribute('data-original-html', h2.innerHTML);
        }
    });

    // 1. EVENTOS DE CONTROL
    if (priceSortSelect) {
        priceSortSelect.addEventListener('change', () => filterProducts(currentCategory));
    }
    if (stockFilterCheckbox) {
        stockFilterCheckbox.addEventListener('change', () => filterProducts(currentCategory));
    }

    // --- 2. FUNCIÓN DE FILTRADO (RECUPERADA DEL HISTORIAL) ---
    window.filterProducts = function(category) {
        currentCategory = category;

        if(searchInput) searchInput.value = "";
        originalContent.style.display = 'block';
        searchResults.style.display = 'none';

        // Gestión de botones activos
        const buttons = document.querySelectorAll('.tag');
        buttons.forEach(btn => {
            if (category === 'Equipos' || category === 'Pilotos') {
                btn.classList.remove('active');
            } else {
                btn.classList.toggle('active', btn.innerText.trim() === (category === 'all' ? 'Todos' : category));
            }
        });

        // Cambio de títulos (Pilotos vs Equipos)
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
                h2.innerHTML = h2.getAttribute('data-original-html');
            }
        });

        // --- LÓGICA DE FILTRADO ---
        const activeCards = []; 

        allProductCards.forEach(card => {
            const text = card.textContent.toLowerCase(); 
            const categoryTag = card.querySelector('.card-category') ? card.querySelector('.card-category').innerText.toLowerCase() : "";
            const btn = card.querySelector('button');

            let visible = false;

            // 1. FILTRO DE CATEGORÍA
            if (category === 'all') {
                visible = true;
            }
            else if (category === 'Ropa') {
                if (categoryTag.includes('ropa') || 
                    text.includes('camiseta') || text.includes('sudadera') || text.includes('chaqueta') || 
                    text.includes('polo') || text.includes('chaleco') || text.includes('jersey') || 
                    text.includes('chubasquero') || text.includes('shirt') || text.includes('hoodie')) {
                    visible = true;
                }
            } 
            else if (category === 'Accesorios') {
                if (categoryTag.includes('accesorios') || 
                    text.includes('gorra') || text.includes('mochila') || text.includes('taza') || 
                    text.includes('llavero') || text.includes('botella') || text.includes('paraguas') || 
                    text.includes('funda') || text.includes('bandera') || text.includes('cartera') || 
                    text.includes('lanyard')) {
                    visible = true;
                }
            } 
            else if (category === 'Coleccionables') {
                if (categoryTag.includes('coleccionables') || text.includes('modelo') || text.includes('casco')) {
                    visible = true;
                }
            }
            else if (category === 'Pilotos') {
                if (categoryTag.includes('piloto') || text.includes('alonso') || text.includes('sainz') || text.includes('verstappen') || text.includes('hamilton') || text.includes('leclerc') || text.includes('russell') || text.includes('norris')) {
                    visible = true;
                }
            }
            else if (category === 'Equipos') {
                if (categoryTag.includes('equipo') || text.includes('team') || text.includes('oficial') || text.includes('scuderia') || text.includes('polo') || text.includes('chaqueta')) {
                    visible = true;
                }
            }

            // 2. FILTRO DE STOCK
            if (stockFilterCheckbox && stockFilterCheckbox.checked) {
                const isSoldOut = btn && (btn.disabled || btn.innerText.toLowerCase().includes('agotado'));
                if (isSoldOut) visible = false; 
            }

            // --- APLICAR VISIBILIDAD (EL ARREGLO ESTÁ AQUÍ) ---
            if (visible) {
                card.style.display = 'flex';
                // ¡ESTO ES LO QUE ARREGLAMOS LA OTRA VEZ!
                // Quitamos la animación para que no se quede transparente
                card.removeAttribute('data-aos'); 
                card.style.opacity = '1'; 
                card.style.visibility = 'visible';
                
                card.parentElement.style.display = 'grid'; 
                activeCards.push(card);
            } else {
                card.style.display = 'none';
            }
        });

        // ORDENAR POR PRECIO
        if (priceSortSelect && priceSortSelect.value !== 'default') {
            const order = priceSortSelect.value;
            activeCards.sort((a, b) => {
                const priceA = parseFloat(a.querySelector('.card-price').innerText.replace('€', '').replace(',', '.'));
                const priceB = parseFloat(b.querySelector('.card-price').innerText.replace('€', '').replace(',', '.'));
                
                if (order === 'asc') return priceA - priceB;
                if (order === 'desc') return priceB - priceA;
                return 0;
            });
            activeCards.forEach(card => card.parentElement.appendChild(card));
        }

        // Limpiar secciones vacías
        const teamSections = document.querySelectorAll('.product-list');
        teamSections.forEach(list => {
            // Contamos solo los visibles
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

    // --- 3. BUSCADOR ---
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
                        // Limpiamos estilos también en búsqueda
                        clone.removeAttribute('data-aos');
                        clone.style.opacity = '1';
                        clone.style.visibility = 'visible';
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

    // --- 4. CLIC EN PRODUCTO ---
    document.addEventListener('click', function(e) {
        const card = e.target.closest('.product-card');
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