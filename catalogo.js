document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. FUNCIONALIDAD DE CLICK EN PRODUCTOS ---
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        card.addEventListener('click', () => {
            // Obtenemos el ID del producto del atributo HTML
            const productId = card.getAttribute('data-product-id');
            
            // Abrimos la página de detalle en una nueva pestaña enviando el ID
            window.open(`index.html?product=${productId}`, '_blank');
        });
    });

    // --- 2. FUNCIONALIDAD DEL BUSCADOR ---
    const searchInput = document.getElementById('searchInput');

    if (searchInput) {
        searchInput.addEventListener('keyup', (e) => {
            const term = e.target.value.toLowerCase();
            
            productCards.forEach(card => {
                // Buscamos en todo el texto de la tarjeta (Título, categoría, precio)
                const content = card.textContent.toLowerCase();
                
                // También intentamos buscar el nombre del equipo (está en el H2 anterior al grupo)
                // Esto es un poco truco: buscamos el título de equipo más cercano hacia arriba
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
});

// --- 3. FUNCIONALIDAD DE FILTROS (BOTONES) ---
function filterProducts(category) {
    const cards = document.querySelectorAll('.product-card');
    const buttons = document.querySelectorAll('.tag');

    // Actualizar visualmente los botones
    buttons.forEach(btn => {
        if (btn.textContent.trim() === (category === 'all' ? 'Todos' : category)) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Filtrar las tarjetas
    cards.forEach(card => {
        const cardCat = card.querySelector('.card-category').textContent;
        
        if (category === 'all' || cardCat.includes(category)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}   