'use strict';

document.addEventListener('DOMContentLoaded', function () {
    // Cambiar carita de reinicio según estado
    window.setCarita = function (estado) {
        var icono = document.getElementById('icono-reiniciar');
        if (icono) {
            if (estado === 'ganar') icono.textContent = '😎';
            else if (estado === 'perder') icono.textContent = '😵';
            else icono.textContent = '🙂';
        }
    };

    // Botón contacto (index.html)
    var botonContacto = document.getElementById('boton-contacto');
    if (botonContacto) {
        botonContacto.onclick = function () {
            var jugando = document.getElementById('juego')?.style.display !== 'none';
            localStorage.setItem('buscaminas_ultimo_estado', jugando ? 'juego' : 'inicio');
            
            // Detectar si estamos en HTMLPreview
            if (window.location.href.includes('htmlpreview.github.io')) {
                window.open('https://htmlpreview.github.io/?https://github.com/MateoSforza/FinalDAW/blob/main/contacto.html', '_blank');
            } else {
                window.location.href = 'contacto.html';
            }
        };
    }

    // Botón volver (contacto.html)
    var volverJuego = document.getElementById('volver-juego');
    if (volverJuego) {
        volverJuego.onclick = function (e) {
            e.preventDefault();
            var estado = localStorage.getItem('buscaminas_ultimo_estado') || 'inicio';
            
            // Detectar si estamos en HTMLPreview
            if (window.location.href.includes('htmlpreview.github.io')) {
                window.open('https://htmlpreview.github.io/?https://github.com/MateoSforza/FinalDAW/blob/main/index.html' + (estado === 'juego' ? '#juego' : ''), '_blank');
            } else {
                window.location.href = 'index.html' + (estado === 'juego' ? '#juego' : '');
            }
        };
    }

    // Botón inspiración (index.html)
    var botonInspiracion = document.getElementById('boton-inspiracion');
    if (botonInspiracion) {
        botonInspiracion.onclick = function () {
            window.open('https://minesweeper.online/es/', '_blank');
        };
    }

    // Botón GitHub (index.html)
    var botonGithub = document.getElementById('boton-github');
    if (botonGithub) {
        botonGithub.onclick = function () {
            window.open('https://github.com/MateoSforza/FinalDAW', '_blank');
        };
    }

    // Botón cambiar nombre
    var botonCambiarNombre = document.getElementById('boton-cambiar-nombre');
    if (botonCambiarNombre) {
        botonCambiarNombre.onclick = function () {
            var juego = document.getElementById('juego');
            var inicio = document.getElementById('inicio-juego');
            if (juego && inicio) {
                juego.style.display = 'none';
                inicio.style.display = 'block';
            }
        };
    }
});
