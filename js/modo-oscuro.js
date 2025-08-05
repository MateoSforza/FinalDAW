'use strict';

// Inicializar modo oscuro desde localStorage al cargar la página
try {
    if (localStorage.getItem('modoOscuro') === 'true') {
        document.addEventListener('DOMContentLoaded', function () {
            document.body.classList.add('modo-oscuro');
        });
    }
} catch (e) {
    // Error silencioso si localStorage no está disponible
}

// Funcionalidad del modo oscuro
document.addEventListener('DOMContentLoaded', function () {
    var botonModo = document.getElementById('boton-modo');
    var iconoModo = document.getElementById('icono-modo');
    if (!botonModo || !iconoModo) return; // Evita errores si no existen

    var modoOscuro = localStorage.getItem('modoOscuro') === 'true';

    if (modoOscuro) {
        document.body.classList.add('modo-oscuro');
        iconoModo.textContent = '☀️';
    } else {
        iconoModo.textContent = '🌙';
    }

    botonModo.onclick = function () {
        modoOscuro = !modoOscuro;
        document.body.classList.toggle('modo-oscuro');

        if (modoOscuro) {
            iconoModo.textContent = '☀️';
            localStorage.setItem('modoOscuro', 'true');
        } else {
            iconoModo.textContent = '🌙';
            localStorage.setItem('modoOscuro', 'false');
        }
    };
});
