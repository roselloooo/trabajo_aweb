document.addEventListener('DOMContentLoaded', () => {
    
    // 1. BUSCADOR (Igual que antes)
    const searchInput = document.getElementById('searchInput');
    const productCards = document.querySelectorAll('.product-card');

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

    // 2. CLIC EN PRODUCTO (LA PARTE IMPORTANTE)
    productCards.forEach(card => {
        card.addEventListener('click', () => {
            // Recogemos los datos DIRECTAMENTE de tu HTML
            const pid = card.getAttribute('data-product-id');
            const imgSrc = card.querySelector('img').src; // <--- AQUÍ COGE TU FOTO
            const title = card.querySelector('h2').innerText;
            const price = card.querySelector('.card-price').innerText;
            const category = card.querySelector('.card-category').innerText;

            // Preparamos la URL para viajar a la siguiente página
            // Usamos 'encodeURIComponent' para que los símbolos de la URL de la foto no rompan nada
            const url = `index.html?id=${pid}&img=${encodeURIComponent(imgSrc)}&title=${encodeURIComponent(title)}&price=${encodeURIComponent(price)}&cat=${encodeURIComponent(category)}`;
            
            // Abrimos la página de detalle
            window.location.href = url;
        });
    });

    // 3. FILTROS (Botones)
    window.filterProducts = function(category) {
        const buttons = document.querySelectorAll('.tag');
        
        buttons.forEach(btn => {
            if (btn.innerText.trim() === (category === 'all' ? 'Todos' : category)) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        productCards.forEach(card => {
            const cardCat = card.querySelector('.card-category').innerText;
            if (category === 'all' || cardCat.includes(category)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    };
});