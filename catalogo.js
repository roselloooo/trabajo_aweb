document.addEventListener('DOMContentLoaded', () => {
    
    const searchInput = document.getElementById('searchInput');
    const originalContent = document.getElementById('originalContent');
    const searchResults = document.getElementById('searchResults');
    const allProductCards = document.querySelectorAll('#originalContent .product-card');
    const teamHeaders = document.querySelectorAll('.team-heading');

    // --- LISTA MAESTRA DE PILOTOS (CONFIGURACIÓN) ---
    // Aquí definimos qué nombres salen para cada equipo
    const driverNames = {
        'ferrari': "Charles Leclerc / Lewis Hamilton",
        'aston-martin': "Fernando Alonso / Lance Stroll",
        'red-bull': "Max Verstappen / Yuki Tsunoda",
        'mercedes': "George Russell / Kimi Antonelli",
        'mclaren': "Lando Norris / Oscar Piastri",
        'williams': "Carlos Sainz / Alex Albon",
        'alpine': "Pierre Gasly / Jack Doohan",
        'racing-bulls': "Liam Lawson / Isack Hadjar", // Asegúrate de que tu HTML tenga la clase 'racing-bulls' o 'vcarb'
        'sauber': "Nico Hülkenberg / Gabriel Bortoleto",
        'haas': "Esteban Ocon / Oliver Bearman"
    };

    // 0. GUARDAR TÍTULOS ORIGINALES
    // Guardamos el HTML original (con el nombre del equipo) para poder volver atrás
    teamHeaders.forEach(h2 => {
        if (!h2.getAttribute('data-original-html')) {
            h2.setAttribute('data-original-html', h2.innerHTML);
        }
    });

    // --- 1. BUSCADOR (Igual que antes) ---
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
                    const parentList = card.closest('.product-list');
                    const teamName = parentList && parentList.previousElementSibling ? parentList.previousElementSibling.textContent.toLowerCase() : "";

                    if (content.includes(term) || teamName.includes(term)) {
                        const clone = card.cloneNode(true);
                        clone.removeAttribute('data-aos');
                        clone.style.opacity = '1';
                        clone.style.visibility = 'visible';
                        clone.style.display = 'flex';
                        searchResults.appendChild(clone);
                        encontrados++;
                    }
                });

                if (encontrados === 0) {
                    searchResults.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: white;">No se encontraron productos para "${term}" 🏎️</p>`;
                }
            } else {
                originalContent.style.display = 'block';
                searchResults.style.display = 'none';
                searchResults.innerHTML = '';
                filterProducts('all');
            }
        });
    }

    // --- 2. FILTROS Y CAMBIO DE NOMBRES ---
    window.filterProducts = function(category) {
        if(searchInput) searchInput.value = "";
        originalContent.style.display = 'block';
        searchResults.style.display = 'none';

        // Gestión de botones
        const buttons = document.querySelectorAll('.tag');
        buttons.forEach(btn => {
            if (category === 'Equipos' || category === 'Pilotos') {
                btn.classList.remove('active');
            } else {
                btn.classList.toggle('active', btn.innerText.trim() === (category === 'all' ? 'Todos' : category));
            }
        });

        // --- MAGIA: CAMBIO DE TÍTULOS ---
        teamHeaders.forEach(h2 => {
            if (category === 'Pilotos') {
                // Buscamos qué clase de equipo tiene este H2
                let newTitle = null;
                
                // Recorremos nuestro diccionario de pilotos
                for (const [teamClass, names] of Object.entries(driverNames)) {
                    if (h2.classList.contains(teamClass)) {
                        newTitle = names;
                        break;
                    }
                }

                if (newTitle) {
                    // Intentamos mantener el logo si existe
                    const img = h2.querySelector('img');
                    if (img) {
                        h2.innerHTML = '';     // Borramos todo
                        h2.appendChild(img);   // Ponemos la imagen
                        h2.append(" " + newTitle); // Ponemos el texto de los pilotos
                    } else {
                        // Si no hay logo, ponemos solo texto
                        h2.innerText = newTitle;
                    }
                }
            } else {
                // Si NO es pilotos, restauramos el original (Nombre del Equipo)
                h2.innerHTML = h2.getAttribute('data-original-html');
            }
        });

        // --- FILTRADO DE TARJETAS (Mejorado) ---
        allProductCards.forEach(card => {
            const text = card.textContent.toLowerCase();
            const categoryTag = card.querySelector('.card-category') ? card.querySelector('.card-category').innerText.toLowerCase() : "";
            
            let visible = false;

            if (category === 'all') visible = true;
            else if (category === 'Ropa') {
                if (text.includes('ropa') || text.includes('camiseta') || text.includes('sudadera') || 
                    text.includes('chaqueta') || text.includes('polo') || text.includes('chaleco')) visible = true;
            } 
            else if (category === 'Accesorios') {
                if (text.includes('accesorios') || text.includes('gorra') || text.includes('mochila') || 
                    text.includes('llavero') || text.includes('botella') || text.includes('taza')) visible = true;
            } 
            else if (category === 'Coleccionables') {
                if (text.includes('coleccionables') || text.includes('modelo') || text.includes('casco')) visible = true;
            }
            else if (category === 'Pilotos') {
                // Filtro ampliado para detectar pilotos
                if (categoryTag.includes('piloto') || 
                    text.includes('alonso') || text.includes('sainz') || text.includes('verstappen') || 
                    text.includes('hamilton') || text.includes('leclerc') || text.includes('russell') || 
                    text.includes('norris') || text.includes('piastri') || text.includes('gasly') || 
                    text.includes('ocon') || text.includes('tsunoda') || text.includes('lawson') ||
                    text.includes('hadjar') || text.includes('bearman') || text.includes('antonelli') ||
                    text.includes('hulkenberg') || text.includes('albon') || text.includes('bortoleto')) {
                    visible = true;
                }
            }
            else if (category === 'Equipos') {
                if (categoryTag.includes('equipo') || text.includes('team') || text.includes('oficial') || 
                    text.includes('polo') || text.includes('chaqueta') || text.includes('sudadera')) {
                    visible = true;
                }
            }

            if (visible) {
                card.style.display = 'flex';
                card.removeAttribute('data-aos'); 
                card.style.opacity = '1';
                card.style.visibility = 'visible';
            } else {
                card.style.display = 'none';
            }
        });

        // LIMPIEZA DE HUECOS
        const teamSections = document.querySelectorAll('#originalContent .product-list');
        teamSections.forEach(list => {
            let count = 0;
            const cards = list.querySelectorAll('.product-card');
            cards.forEach(c => { if (c.style.display !== 'none') count++; });

            const title = list.previousElementSibling;
            if (count > 0) {
                list.style.display = 'grid';
                if(title) title.style.display = 'block';
            } else {
                list.style.display = 'none';
                if(title) title.style.display = 'none';
            }
        });
    };

    // --- 3. CLIC EN PRODUCTO ---
    document.addEventListener('click', function(e) {
        const card = e.target.closest('.product-card');
        if (card) {
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