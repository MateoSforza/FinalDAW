'use strict';
// Autor: Mateo Sforza - Validación de formularios y envío de correo

var formContacto = document.getElementById('form-contacto');
var inputNombre = document.getElementById('contacto-nombre');
var inputMail = document.getElementById('contacto-mail');
var inputMensaje = document.getElementById('contacto-mensaje');
var mensajeDiv = document.getElementById('mensaje-contacto');

formContacto.addEventListener('submit', function(evento) {
    evento.preventDefault();
    var nombre = inputNombre.value.trim();
    var mail = inputMail.value.trim();
    var mensaje = inputMensaje.value.trim();
    if (!validarNombre(nombre)) {
        mostrarMensaje('El nombre debe ser alfanumérico y tener al menos 3 caracteres.', true);
        return;
    }
    if (!validarMail(mail)) {
        mostrarMensaje('El correo electrónico no es válido.', true);
        return;
    }
    if (mensaje.length < 6) {
        mostrarMensaje('El mensaje debe tener al menos 6 caracteres.', true);
        return;
    }
    // Abrir cliente de correo predeterminado
    var asunto = encodeURIComponent('Contacto desde Buscaminas Web');
    var cuerpo = encodeURIComponent('Nombre: ' + nombre + '\nEmail: ' + mail + '\nMensaje: ' + mensaje);
    window.location.href = 'mailto:?subject=' + asunto + '&body=' + cuerpo;
    mostrarMensaje('¡Mensaje preparado en tu cliente de correo!', false);
    formContacto.reset();
});

function validarNombre(nombre) {
    var regex = /^[a-zA-Z0-9]{3,}$/;
    return regex.test(nombre);
}

function validarMail(mail) {
    var regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return regex.test(mail);
}

function mostrarMensaje(texto, esError) {
    mensajeDiv.textContent = texto;
    mensajeDiv.style.display = 'block';
    mensajeDiv.style.color = esError ? '#d32f2f' : '#388e3c';
} 