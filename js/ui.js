'use strict';

// Funcionalidades de UI separadas del HTML

// Cambiar carita de reinicio según estado
function setCarita(estado) {
    var icono = document.getElementById('icono-reiniciar');
    if (estado === 'ganar') icono.textContent = '😎';
    else if (estado === 'perder') icono.textContent = '😵';
    else icono.textContent = '🙂';
}
window.setCarita = setCarita;

// Guardar estado antes de ir a contacto
document.getElementById('boton-contacto').onclick = function() {
    var jugando = document.getElementById('juego').style.display !== 'none';
    localStorage.setItem('buscaminas_ultimo_estado', jugando ? 'juego' : 'inicio');
    window.location.href = 'contacto.html';
};

// Botón cambiar nombre
document.getElementById('boton-cambiar-nombre').onclick = function() {
    document.getElementById('juego').style.display = 'none';
    document.getElementById('inicio-juego').style.display = 'block';
}; 

// Botón volver al juego desde contacto.html
var volverJuego = document.getElementById('volver-juego');
if (volverJuego) {
    volverJuego.onclick = function(e) {
        e.preventDefault();
        var estado = localStorage.getItem('buscaminas_ultimo_estado') || 'inicio';
        window.location.href = 'index.html' + (estado === 'juego' ? '#juego' : '');
    };
}
