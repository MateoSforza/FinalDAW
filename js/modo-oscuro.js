'use strict';

// Funcionalidad del modo oscuro
var botonModo = document.getElementById('boton-modo');
var iconoModo = document.getElementById('icono-modo');
var modoOscuro = false;

// Verificar estado guardado al cargar
if (localStorage.getItem('modoOscuro') === 'true') {
    modoOscuro = true;
    document.body.classList.add('modo-oscuro');
    iconoModo.textContent = '☀️';
}

botonModo.onclick = function() {
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