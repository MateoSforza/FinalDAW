'use strict';

// ============================================================================
// VARIABLES GLOBALES
// ============================================================================
var filas = 8;
var columnas = 8;
var minas = 10;
var tablero = [];
var minasRestantes = minas;
var nombreJugador = '';
var primerClick = true;
var primerClickPos = null;
var nivelActual = 'facil';
var timer = null;
var tiempo = 0;
var juegoIniciado = false;
var juegoTerminado = false;
var ultimaDuracion = 0;

// ============================================================================
// ELEMENTOS DEL DOM
// ============================================================================
var formNombre = document.getElementById('form-nombre-jugador');
var inputNombre = document.getElementById('nombre-jugador');
var seccionInicio = document.getElementById('inicio-juego');
var seccionJuego = document.getElementById('juego');
var tableroDiv = document.getElementById('tablero');
var contadorMinas = document.getElementById('contador-minas');
var cronometro = document.getElementById('cronometro');
var botonReiniciar = document.getElementById('boton-reiniciar');
var botonRanking = document.getElementById('boton-ranking');
var modalRanking = document.getElementById('modal-ranking');
var cerrarRanking = document.getElementById('cerrar-ranking');
var tablaRanking = document.getElementById('tabla-ranking').getElementsByTagName('tbody')[0];
var ordenarPuntaje = document.getElementById('ordenar-puntaje');
var ordenarFecha = document.getElementById('ordenar-fecha');
var selectDificultad = document.getElementById('dificultad');

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

// ============================================================================
// FUNCIONES DE CONFIGURACIÓN Y DIFICULTAD
// ============================================================================
function setDificultad(dificultad) {
    switch (dificultad) {
        case 'facil': filas = 8; columnas = 8; minas = 10; break;
        case 'medio': filas = 12; columnas = 12; minas = 25; break;
        case 'dificil': filas = 16; columnas = 16; minas = 40; break;
    }
    minasRestantes = minas;
    contadorMinas.textContent = minasRestantes;
}

function mostrarBotonesNivel(mostrar) {
    var contenedor = document.getElementsByClassName('botones-nivel-juego')[0];
    contenedor.classList.toggle('oculto', !mostrar);
}

// ============================================================================
// FUNCIONES DE INICIALIZACIÓN DEL JUEGO
// ============================================================================
function iniciarJuego() {
    minasRestantes = minas;
    contadorMinas.textContent = minasRestantes;
    primerClick = true;
    primerClickPos = null;
    generarTablero();
    if (window.setCarita) window.setCarita('jugando');
}

function reiniciarPartida() {
    seccionJuego.style.display = 'block';
    seccionInicio.style.display = 'none';
    if (timer) clearInterval(timer);
    tiempo = 0;
    cronometro.textContent = '000';
    juegoIniciado = false;
    juegoTerminado = false;
    minasRestantes = minas;
    contadorMinas.textContent = minasRestantes;
    primerClick = true;
    primerClickPos = null;
    generarTablero();
    document.getElementById('modal-mensaje').style.display = 'none';
    if (window.setCarita) window.setCarita('jugando');
    mostrarBotonesNivel(true);
}

// ============================================================================
// FUNCIONES DE LÓGICA DEL JUEGO
// ============================================================================
function generarTablero(excluirF, excluirC) {
    tablero = [];
    tableroDiv.innerHTML = '';
    for (var f = 0; f < filas; f++) {
        var fila = [];
        for (var c = 0; c < columnas; c++) {
            fila.push({ mina: false, revelada: false, bandera: false, minasVecinas: 0 });
        }
        tablero.push(fila);
    }

    if (typeof excluirF === 'number' && typeof excluirC === 'number') {
        var prohibidas = {};
        for (var df = -1; df <= 1; df++) {
            for (var dc = -1; dc <= 1; dc++) {
                var nf = excluirF + df;
                var nc = excluirC + dc;
                if (nf >= 0 && nf < filas && nc >= 0 && nc < columnas) {
                    prohibidas[nf + ',' + nc] = true;
                }
            }
        }

        var minasColocadas = 0;
        while (minasColocadas < minas) {
            var rf = Math.floor(Math.random() * filas);
            var rc = Math.floor(Math.random() * columnas);
            if (!tablero[rf][rc].mina && !prohibidas[rf + ',' + rc]) {
                tablero[rf][rc].mina = true;
                minasColocadas++;
            }
        }

        for (var f = 0; f < filas; f++) {
            for (var c = 0; c < columnas; c++) {
                tablero[f][c].minasVecinas = contarMinasVecinas(f, c);
            }
        }
    }

    for (var f = 0; f < filas; f++) {
        var filaDiv = document.createElement('div');
        filaDiv.className = 'fila-tablero';
        for (var c = 0; c < columnas; c++) {
            var celda = document.createElement('button');
            celda.className = 'celda';
            celda.setAttribute('data-fila', f);
            celda.setAttribute('data-col', c);
            celda.oncontextmenu = function (e) { e.preventDefault(); };
            celda.addEventListener('click', revelarCeldaHandler);
            celda.addEventListener('contextmenu', banderaCeldaHandler);
            filaDiv.appendChild(celda);
        }
        tableroDiv.appendChild(filaDiv);
    }
}
function revelarCeldaHandler(evento) {
    if (juegoTerminado) return;
    var f = parseInt(this.getAttribute('data-fila'));
    var c = parseInt(this.getAttribute('data-col'));
    revelarCelda(f, c);
}

function banderaCeldaHandler(evento) {
    evento.preventDefault();
    if (juegoTerminado) return;
    var f = parseInt(this.getAttribute('data-fila'));
    var c = parseInt(this.getAttribute('data-col'));
    colocarBandera(f, c, this);
}

function revelarCelda(f, c) {
    var celda = tablero[f][c];
    if (celda.revelada || celda.bandera) return;

    if (primerClick) {
        primerClick = false;
        primerClickPos = { f: f, c: c };
        generarTablero(f, c);
        iniciarTemporizador();
        juegoIniciado = true;
    }

    if (celda.mina) {
        celda.revelada = true;
        var boton = buscarBotonCelda(f, c);
        if (boton) {
            boton.textContent = '💣';
            boton.classList.add('revelada', 'mina');
        }
        mostrarTodasLasMinas();
        terminarJuego();
        mostrarMensaje('¡Perdiste! Has pisado una mina.');
        if (window.setCarita) window.setCarita('perder');
        return;
    }

    celda.revelada = true;
    var boton = buscarBotonCelda(f, c);
    if (boton) {
        boton.classList.add('revelada');
        if (celda.minasVecinas > 0) {
            boton.textContent = celda.minasVecinas;
            boton.style.color = getColorNumero(celda.minasVecinas);
        } else {
            expandirVacias(f, c);
        }
    }

    if (verificarVictoria()) {
        terminarJuego();
        mostrarMensaje('¡Ganaste! Has encontrado todas las minas.');
        if (window.setCarita) window.setCarita('ganar');
    }
}

function expandirVacias(f, c) {
    for (var df = -1; df <= 1; df++) {
        for (var dc = -1; dc <= 1; dc++) {
            if (df === 0 && dc === 0) continue;
            var nf = f + df;
            var nc = c + dc;
            if (nf >= 0 && nf < filas && nc >= 0 && nc < columnas) {
                var celdaVecina = tablero[nf][nc];
                if (!celdaVecina.revelada && !celdaVecina.bandera) {
                    revelarCelda(nf, nc);
                }
            }
        }
    }
}

function contarMinasVecinas(f, c) {
    var total = 0;
    for (var df = -1; df <= 1; df++) {
        for (var dc = -1; dc <= 1; dc++) {
            if (df === 0 && dc === 0) continue;
            var nf = f + df;
            var nc = c + dc;
            if (nf >= 0 && nf < filas && nc >= 0 && nc < columnas) {
                if (tablero[nf][nc].mina) total++;
            }
        }
    }
    return total;
}

function verificarVictoria() {
    for (var f = 0; f < filas; f++) {
        for (var c = 0; c < columnas; c++) {
            var celda = tablero[f][c];
            if (!celda.mina && !celda.revelada) {
                return false;
            }
        }
    }
    return true;
}

// ============================================================================
// FUNCIONES DE INTERFAZ Y UTILIDADES
// ============================================================================
function mostrarMensaje(mensaje) {
    var modal = document.getElementById('modal-mensaje');
    var mensajeFinal = document.getElementById('mensaje-final');
    mensajeFinal.textContent = mensaje;
    modal.style.display = 'block';
    var cerrar = document.getElementById('cerrar-modal');
    cerrar.onclick = function () {
        modal.style.display = 'none';
    };
}

function iniciarTemporizador() {
    timer = setInterval(function () {
        tiempo++;
        cronometro.textContent = tiempo < 10 ? '00' + tiempo :
                                 tiempo < 100 ? '0' + tiempo : tiempo;
    }, 1000);
}

function terminarJuego() {
    juegoTerminado = true;
    if (timer) clearInterval(timer);
    ultimaDuracion = tiempo;
    if (verificarVictoria()) {
        var puntaje = minas * 10 - ultimaDuracion;
        if (puntaje < 0) puntaje = 0;
        guardarPartida(puntaje, ultimaDuracion);
    }
}

function buscarBotonCelda(f, c) {
    if (f < 0 || f >= tableroDiv.children.length) return null;
    var filaDiv = tableroDiv.children[f];
    if (!filaDiv || c < 0 || c >= filaDiv.children.length) return null;
    return filaDiv.children[c];
}

function colocarBandera(f, c, boton) {
    var celda = tablero[f][c];
    if (celda.revelada) return;
    celda.bandera = !celda.bandera;
    if (celda.bandera) {
        boton.textContent = '🚩';
        minasRestantes--;
        if (typeof sonidoBandera !== 'undefined') sonidoBandera.play();
    } else {
        boton.textContent = '';
        minasRestantes++;
    }
    if (minasRestantes < 0) minasRestantes = 0;
    contadorMinas.textContent = minasRestantes;
}

function mostrarTodasLasMinas() {
    for (var f = 0; f < filas; f++) {
        for (var c = 0; c < columnas; c++) {
            var celda = tablero[f][c];
            if (celda.mina) {
                var boton = buscarBotonCelda(f, c);
                if (boton) {
                    boton.textContent = '💣';
                    boton.classList.add('revelada', 'mina');
                }
            }
        }
    }
}

function getColorNumero(numero) {
    var colores = ['', '#1976d2', '#388e3c', '#d32f2f', '#7b1fa2', '#f57c00', '#00796b', '#5d4037', '#424242'];
    return colores[numero] || '#000';
}

function guardarPartida(puntaje, duracion) {
    var key = 'buscaminas_partidas_' + nivelActual;
    var partidas = JSON.parse(localStorage.getItem(key) || '[]');
    var fecha = new Date();
    partidas.push({
        jugador: nombreJugador,
        puntaje: puntaje,
        duracion: duracion,
        fecha: fecha.toLocaleDateString() + ' ' + fecha.toLocaleTimeString()
    });
    localStorage.setItem(key, JSON.stringify(partidas));
}

function mostrarRanking(orden) {
    var key = 'buscaminas_partidas_' + nivelActual;
    var partidas = JSON.parse(localStorage.getItem(key) || '[]');
    if (orden === 'puntaje') {
        partidas.sort(function (a, b) { return b.puntaje - a.puntaje; });
    } else if (orden === 'fecha') {
        partidas.sort(function (a, b) { return new Date(b.fecha) - new Date(a.fecha); });
    }
    tablaRanking.innerHTML = '';
    partidas.forEach(function (partida) {
        var fila = tablaRanking.insertRow();
        fila.insertCell(0).textContent = partida.jugador;
        fila.insertCell(1).textContent = partida.puntaje;
        fila.insertCell(2).textContent = partida.duracion + 's';
        fila.insertCell(3).textContent = partida.fecha;
    });
    modalRanking.style.display = 'block';
}

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
