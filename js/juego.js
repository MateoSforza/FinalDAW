'use strict';

// Archivo principal de lógica del juego Buscaminas
// Aquí se implementará la generación del tablero, manejo de eventos y lógica principal

// Variables globales
var filas = 8;
var columnas = 8;
var minas = 10;
var tablero = [];
var minasRestantes = minas;
var nombreJugador = '';
var primerClick = true;
var primerClickPos = null;
var nivelActual = 'facil';

// Elementos del DOM
var formNombre = document.getElementById('form-nombre-jugador');
var inputNombre = document.getElementById('nombre-jugador');
var seccionInicio = document.getElementById('inicio-juego');
var seccionJuego = document.getElementById('juego');
var tableroDiv = document.getElementById('tablero');
var contadorMinas = document.getElementById('contador-minas');
var cronometro = document.getElementById('cronometro');
var botonReiniciar = document.getElementById('boton-reiniciar');
var timer = null;
var tiempo = 0;
var juegoIniciado = false;
var juegoTerminado = false;
var botonRanking = document.getElementById('boton-ranking');
var modalRanking = document.getElementById('modal-ranking');
var cerrarRanking = document.getElementById('cerrar-ranking');
var tablaRanking = document.getElementById('tabla-ranking').getElementsByTagName('tbody')[0];
var ordenarPuntaje = document.getElementById('ordenar-puntaje');
var ordenarFecha = document.getElementById('ordenar-fecha');
var ultimaDuracion = 0;
var selectDificultad = document.getElementById('dificultad');

// Botones de nivel
var botonesNivel = document.getElementsByClassName('boton-nivel');
for (var i = 0; i < botonesNivel.length; i++) {
    botonesNivel[i].onclick = function() {
        var nivel = this.getAttribute('data-nivel');
        setDificultad(nivel);
        nivelActual = nivel;
        for (var j = 0; j < botonesNivel.length; j++) {
            botonesNivel[j].classList.remove('selected');
        }
        this.classList.add('selected');
        primerClick = true;
        primerClickPos = null;
        iniciarJuego();
    };
    if (botonesNivel[i].getAttribute('data-nivel') === nivelActual) {
        botonesNivel[i].classList.add('selected');
    }
}
// Botón inspiración
var botonInspiracion = document.getElementById('boton-inspiracion');
botonInspiracion.onclick = function() {
    window.open('https://minesweeper.online/es/', '_blank');
};
// Botón contacto
var botonContacto = document.getElementById('boton-contacto');
botonContacto.onclick = function() {
    window.location.href = 'contacto.html';
};
// Botón Github (placeholder)
var botonGithub = document.getElementById('boton-github');
botonGithub.onclick = function() {
    window.open('https://github.com/MateoSforza/D.A.W', '_blank');
};

function mostrarBotonesNivel(mostrar) {
    var contenedor = document.getElementsByClassName('botones-nivel-juego')[0];
    if (mostrar) {
        contenedor.classList.remove('oculto');
    } else {
        contenedor.classList.add('oculto');
    }
}

// Validación del nombre y comienzo del juego
formNombre.addEventListener('submit', function(evento) {
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

function validarNombre(nombre) {
    // Solo letras y números, mínimo 3 caracteres
    var regex = /^[a-zA-Z0-9]{3,}$/;
    return regex.test(nombre);
}

function mostrarErrorNombre() {
    // Modal simple para mostrar error (puedes mejorar esto luego)
    alert('El nombre debe tener al menos 3 letras o números, sin espacios ni símbolos.');
}

function iniciarJuego() {
    minasRestantes = minas;
    contadorMinas.textContent = minasRestantes;
    primerClick = true;
    primerClickPos = null;
    generarTablero(); // Sin minas hasta el primer click
    if (window.setCarita) window.setCarita('jugando');
}

function generarTablero(excluirF, excluirC) {
    tablero = [];
    tableroDiv.innerHTML = '';
    // Crear matriz vacía
    for (var f = 0; f < filas; f++) {
        var fila = [];
        for (var c = 0; c < columnas; c++) {
            fila.push({
                mina: false,
                revelada: false,
                bandera: false,
                minasVecinas: 0
            });
        }
        tablero.push(fila);
    }
    // Si se pasa una posición a excluir, colocar minas evitando esa celda y sus vecinas
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
        // Calcular minas vecinas
        for (var f = 0; f < filas; f++) {
            for (var c = 0; c < columnas; c++) {
                tablero[f][c].minasVecinas = contarMinasVecinas(f, c);
            }
        }
    }
    // Dibujar tablero en el DOM
    for (var f = 0; f < filas; f++) {
        var filaDiv = document.createElement('div');
        filaDiv.className = 'fila-tablero';
        for (var c = 0; c < columnas; c++) {
            var celda = document.createElement('button');
            celda.className = 'celda';
            celda.setAttribute('data-fila', f);
            celda.setAttribute('data-col', c);
            celda.oncontextmenu = function(e) { e.preventDefault(); };
            celda.addEventListener('click', revelarCeldaHandler);
            celda.addEventListener('contextmenu', banderaCeldaHandler);
            filaDiv.appendChild(celda);
        }
        tableroDiv.appendChild(filaDiv);
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
    if (juegoTerminado) return;
    if (primerClick) {
        primerClick = false;
        primerClickPos = {f: f, c: c};
        generarTablero(f, c); // Generar minas evitando el primer click y sus vecinos
        if (!juegoIniciado) {
            iniciarTemporizador();
            juegoIniciado = true;
        }
    }
    var celda = tablero[f][c];
    if (celda.revelada || celda.bandera) {
        return;
    }
    celda.revelada = true;
    var boton = buscarBotonCelda(f, c);
    if (!boton) return;
    boton.classList.add('revelada');
    if (celda.mina) {
        boton.textContent = '💣';
        mostrarMensaje('¡Perdiste! Pisaste una mina.');
        deshabilitarTablero();
        terminarJuego();
        sonidoPerder.play();
        if (window.setCarita) window.setCarita('perder');
        return;
    }
    if (celda.minasVecinas > 0) {
        boton.textContent = celda.minasVecinas;
    } else {
        boton.textContent = '';
        expandirVacias(f, c);
    }
    if (verificarVictoria()) {
        mostrarMensaje('¡Ganaste! Has encontrado todas las minas.');
        deshabilitarTablero();
        terminarJuego();
        sonidoGanar.play();
        if (window.setCarita) window.setCarita('ganar');
    }
}

function moverMina(f, c) {
    // Quitar la mina de la celda clickeada
    tablero[f][c].mina = false;
    // Buscar una celda vacía sin mina
    var libres = [];
    for (var i = 0; i < filas; i++) {
        for (var j = 0; j < columnas; j++) {
            if (!tablero[i][j].mina && (i !== f || j !== c)) {
                libres.push({f: i, c: j});
            }
        }
    }
    if (libres.length > 0) {
        var idx = Math.floor(Math.random() * libres.length);
        tablero[libres[idx].f][libres[idx].c].mina = true;
    }
}

function expandirVacias(f, c) {
    for (var df = -1; df <= 1; df++) {
        for (var dc = -1; dc <= 1; dc++) {
            var nf = f + df;
            var nc = c + dc;
            if (nf >= 0 && nf < filas && nc >= 0 && nc < columnas) {
                if (!(df === 0 && dc === 0)) {
                    var celdaVecina = tablero[nf][nc];
                    if (!celdaVecina.revelada && !celdaVecina.mina && !celdaVecina.bandera) {
                        celdaVecina.revelada = true;
                        var botonVecino = buscarBotonCelda(nf, nc);
                        if (botonVecino) {
                            botonVecino.classList.add('revelada');
                            if (celdaVecina.minasVecinas > 0) {
                                botonVecino.textContent = celdaVecina.minasVecinas;
                            } else {
                                botonVecino.textContent = '';
                                expandirVacias(nf, nc);
                            }
                        }
                    }
                }
            }
        }
    }
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

function mostrarMensaje(mensaje) {
    var modal = document.getElementById('modal-mensaje');
    var mensajeFinal = document.getElementById('mensaje-final');
    mensajeFinal.textContent = mensaje;
    modal.style.display = 'block';
    var cerrar = document.getElementById('cerrar-modal');
    cerrar.onclick = function() {
        modal.style.display = 'none';
    };
}

function deshabilitarTablero() {
    for (var f = 0; f < filas; f++) {
        for (var c = 0; c < columnas; c++) {
            var boton = buscarBotonCelda(f, c);
            if (boton) {
                boton.disabled = true;
            }
        }
    }
}

function colocarBandera(f, c, boton) {
    var celda = tablero[f][c];
    if (celda.revelada) {
        return;
    }
    celda.bandera = !celda.bandera;
    if (celda.bandera) {
        boton.textContent = '🚩';
        minasRestantes--;
        sonidoBandera.play();
    } else {
        boton.textContent = '';
        minasRestantes++;
    }
    contadorMinas.textContent = minasRestantes;
}

function iniciarTemporizador() {
    timer = setInterval(function() {
        tiempo++;
        if (tiempo < 10) {
            cronometro.textContent = '00' + tiempo;
        } else if (tiempo < 100) {
            cronometro.textContent = '0' + tiempo;
        } else {
            cronometro.textContent = tiempo;
        }
    }, 1000);
}

function terminarJuego() {
    juegoTerminado = true;
    if (timer) {
        clearInterval(timer);
    }
    ultimaDuracion = tiempo;
    if (verificarVictoria()) {
        // Puntaje: minas*10 - tiempo
        var puntaje = minas * 10 - ultimaDuracion;
        if (puntaje < 0) puntaje = 0;
        guardarPartida(puntaje, ultimaDuracion);
    }
}

function reiniciarPartida() {
    seccionJuego.style.display = 'block';
    seccionInicio.style.display = 'none';
    if (timer) {
        clearInterval(timer);
    }
    tiempo = 0;
    cronometro.textContent = '000';
    juegoIniciado = false;
    juegoTerminado = false;
    minasRestantes = minas;
    contadorMinas.textContent = minasRestantes;
    primerClick = true;
    primerClickPos = null;
    generarTablero(); // Sin minas hasta el primer click
    var modal = document.getElementById('modal-mensaje');
    modal.style.display = 'none';
    if (window.setCarita) window.setCarita('jugando');
    mostrarBotonesNivel(true);
}

function buscarBotonCelda(f, c) {
    // Busca el botón correspondiente en el DOM, validando rangos
    if (f < 0 || f >= tableroDiv.children.length) return null;
    var filaDiv = tableroDiv.children[f];
    if (!filaDiv || c < 0 || c >= filaDiv.children.length) return null;
    return filaDiv.children[c];
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
        partidas.sort(function(a, b) { return b.puntaje - a.puntaje; });
    } else if (orden === 'fecha') {
        partidas.sort(function(a, b) { return new Date(b.fecha) - new Date(a.fecha); });
    }
    tablaRanking.innerHTML = '';
    for (var i = 0; i < partidas.length; i++) {
        var fila = document.createElement('tr');
        fila.innerHTML = '<td>' + partidas[i].jugador + '</td>' +
                         '<td>' + partidas[i].puntaje + '</td>' +
                         '<td>' + partidas[i].duracion + 's</td>' +
                         '<td>' + partidas[i].fecha + '</td>';
        tablaRanking.appendChild(fila);
    }
    modalRanking.style.display = 'flex';
}

function setDificultad(dificultad) {
    if (dificultad === 'facil') {
        filas = 8;
        columnas = 8;
        minas = 10;
    } else if (dificultad === 'medio') {
        filas = 12;
        columnas = 12;
        minas = 25;
    } else if (dificultad === 'dificil') {
        filas = 16;
        columnas = 16;
        minas = 40;
    }
}

// Sonidos
var sonidoGanar = new Audio('img/ganar.mp3');
var sonidoPerder = new Audio('img/perder.mp3');
var sonidoBandera = new Audio('img/bandera.mp3');

// Asignar event listeners de reinicio y ranking (asegurar que siempre estén activos)
botonReiniciar.onclick = reiniciarPartida;
document.addEventListener('keydown', function(e) {
    if (e.code === 'Space') {
        reiniciarPartida();
    }
});
botonRanking.onclick = function() {
    mostrarRanking('puntaje');
};
cerrarRanking.onclick = function() {
    modalRanking.style.display = 'none';
};
ordenarPuntaje.onclick = function() {
    mostrarRanking('puntaje');
};
ordenarFecha.onclick = function() {
    mostrarRanking('fecha');
};

window.onload = function() {
    mostrarBotonesNivel(false);
    if (window.location.hash === '#juego') {
        seccionInicio.style.display = 'none';
        seccionJuego.style.display = 'block';
        mostrarBotonesNivel(true);
    }
}; 