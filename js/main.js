// ============================================================================
// EVENT LISTENERS
// ============================================================================
formNombre.addEventListener('submit', function (evento) {
    evento.preventDefault();
    var nombre = inputNombre.value.trim();
    var dificultad = selectDificultad.value;
    if (validarNombre(nombre)) {
        nombreJugador = nombre;
        setDificultad(dificultad);
        seccionInicio.style.display = 'none';
        seccionJuego.style.display = 'block';
        primerClick = true;
        iniciarJuego();
        mostrarBotonesNivel(true);
    } else {
        mostrarErrorNombre();
    }
});

Array.from(document.getElementsByClassName('boton-nivel')).forEach(function (boton) {
    boton.onclick = function () {
        var nivel = this.getAttribute('data-nivel');
        setDificultad(nivel);
        nivelActual = nivel;
        Array.from(document.getElementsByClassName('boton-nivel')).forEach(b => b.classList.remove('selected'));
        this.classList.add('selected');
        primerClick = true;
        primerClickPos = null;
        iniciarJuego();
    };
});

botonRanking.onclick = function () {
    mostrarRanking('puntaje');
};
cerrarRanking.onclick = function () {
    modalRanking.style.display = 'none';
};
ordenarPuntaje.onclick = function () {
    mostrarRanking('puntaje');
};
ordenarFecha.onclick = function () {
    mostrarRanking('fecha');
};
botonReiniciar.onclick = reiniciarPartida;
