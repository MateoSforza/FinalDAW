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