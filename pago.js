document.addEventListener('DOMContentLoaded', () => {
    
    // 1. RECUPERAR EL SUBTOTAL (PRECIO DE LOS PRODUCTOS)
    const subtotalRaw = localStorage.getItem('f1TotalPagar');
    
    // Elementos del HTML
    const subtotalDisplay = document.getElementById('subtotal-display');
    const totalDisplay = document.getElementById('total-amount-display'); 
    const botonPagar = document.getElementById('confirm-payment-btn');

    if (subtotalRaw) {
        // CONVERTIR TEXTO A NÚMERO PARA PODER SUMAR
        // Quitamos el "€" y cambiamos la coma por punto si hace falta
        let subtotalNum = parseFloat(subtotalRaw.replace('€', '').replace(',', '.'));
        let envio = 5.00;
        let totalFinal = subtotalNum + envio;

        // Formateamos para que quede bonito (con dos decimales y el €)
        let totalTexto = totalFinal.toFixed(2) + "€";

        // 2. ACTUALIZAR LA PANTALLA
        if (subtotalDisplay) subtotalDisplay.innerText = subtotalRaw; // Muestra lo que venía del carrito
        if (totalDisplay) totalDisplay.innerText = totalTexto;        // Muestra la suma con el envío

        // 3. ACTUALIZAR EL BOTÓN
        if (botonPagar) {
            if (botonPagar.tagName === 'INPUT') {
                botonPagar.value = `Pagar ${totalTexto}`;
            } else {
                botonPagar.innerHTML = `Pagar Ahora <span style="font-weight:bold;">(${totalTexto})</span>`;
            }
        }
        
        console.log(`Cálculo: ${subtotalNum} + ${envio} = ${totalFinal}`);

    } else {
        // Si entra alguien sin productos
        if (totalDisplay) totalDisplay.innerText = "0.00€";
    }
});