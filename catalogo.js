document.addEventListener('DOMContentLoaded', () => {
    
    const searchInput = document.getElementById('searchInput');
    const originalContent = document.getElementById('originalContent');
    const searchResults = document.getElementById('searchResults');
    const allProductCards = document.querySelectorAll('#originalContent .product-card');

    // 1. LÓGICA DE BÚSQUEDA TIPO "GOOGLE"
    if (searchInput) {
        searchInput.addEventListener('keyup', (e) => {
            const term = e.target.value.toLowerCase().trim();

            if (term.length > 0) {
                // MODO BÚSQUEDA ACTIVADO
                originalContent.style.display = 'none'; // Ocultar catálogo normal
                searchResults.style.display = 'grid';   // Mostrar zona de resultados
                searchResults.innerHTML = '';           // Limpiar resultados anteriores

                let encontrados = 0;

                allProductCards.forEach(card => {
                    const content = card.textContent.toLowerCase();
                    // Buscamos también el nombre del equipo (H2 anterior)
                    const section = card.closest('.product-list').previousElementSibling; 
                    const teamName = section ? section.textContent.toLowerCase() : "";

                    if (content.includes(term) || teamName.includes(term)) {
                        // CLONAR LA TARJETA (Hacemos una copia para ponerla arriba)
                        const clone = card.cloneNode(true);
                        searchResults.appendChild(clone);
                        encontrados++;
                    }
                });

                if (encontrados === 0) {
                    searchResults.innerHTML = `<p style="grid-column: 1/-1; text-align: center; font-size: 1.2rem;">No se encontraron productos para "${term}" 🏎️</p>`;
                }

            } else {
                // MODO NORMAL (Buscador vacío)
                originalContent.style.display = 'block';
                searchResults.style.display = 'none';
                searchResults.innerHTML = '';
            }
        });
    }

    // 2. FILTROS (Solo funcionan en modo normal para no liar)
    window.filterProducts = function(category) {
        // Limpiamos buscador si se usa filtro
        if(searchInput) searchInput.value = "";
        originalContent.style.display = 'block';
        searchResults.style.display = 'none';

        const buttons = document.querySelectorAll('.tag');
        buttons.forEach(btn => btn.classList.toggle('active', btn.innerText.trim() === (category === 'all' ? 'Todos' : category)));
        
        allProductCards.forEach(card => {
            const cardCat = card.querySelector('.card-category').innerText;
            if (category === 'all' || cardCat.includes(category)) {
                card.style.display = 'flex';
                // Asegurar que la sección padre se vea
                card.parentElement.previousElementSibling.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    };

    // 3. CLIC EN PRODUCTO (DELEGACIÓN DE EVENTOS)
    // Esto es magia: detecta el clic en CUALQUIER parte, sea el catálogo original o los resultados de búsqueda
    document.addEventListener('click', function(e) {
        // Buscamos si lo que se clicó está dentro de una .product-card
        const card = e.target.closest('.product-card');
        
        if (card) {
            // Cogemos los datos de la tarjeta clicada
            const pid = card.getAttribute('data-product-id');
            const imgSrc = card.querySelector('img').src; 
            const title = card.querySelector('h2').innerText;
            const price = card.querySelector('.card-price').innerText;
            
            let category = "Producto F1";
            const catElem = card.querySelector('.card-category');
            if (catElem) category = catElem.innerText;

            const url = `index.html?id=${pid}&img=${encodeURIComponent(imgSrc)}&title=${encodeURIComponent(title)}&price=${encodeURIComponent(price)}&cat=${encodeURIComponent(category)}`;
            
            // Redirigir
            window.open(url, '_blank');
        }
    });
});