// ============================================================================
// FUNCIONES DE VALIDACIÓN
// ============================================================================
function validarNombre(nombre) {
    var regex = /^[a-zA-Z0-9]{3,}$/;
    return regex.test(nombre);
}

function mostrarErrorNombre() {
    var modal = document.getElementById('modal-mensaje');
    var mensajeFinal = document.getElementById('mensaje-final');
    mensajeFinal.textContent = 'El nombre debe tener al menos 3 letras o números, sin espacios ni símbolos.';
    modal.style.display = 'block';
    var cerrar = document.getElementById('cerrar-modal');
    cerrar.onclick = function () {
        modal.style.display = 'none';
    };
}
