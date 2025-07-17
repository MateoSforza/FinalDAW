# Buscaminas Web

Proyecto final para la materia **Desarrollo y Arquitecturas Web 2025**.

Este proyecto es una versión web interactiva del clásico juego Buscaminas, desarrollada con HTML5, CSS3 y JavaScript ES5, cumpliendo con buenas prácticas de organización, accesibilidad y experiencia de usuario.

## Características principales

- Validación de nombre de usuario
- Generación dinámica del tablero con minas aleatorias
- Primer clic siempre seguro (sin mina ni minas vecinas)
- Clic izquierdo: revela celda / Clic derecho: coloca bandera
- Expansión recursiva de celdas vacías
- Detección de victoria y derrota
- Temporizador y contador de minas
- Reinicio sin recargar la página
- Modales para mensajes de juego
- Sonidos para eventos
- Modo claro/oscuro con persistencia (excepto contacto)
- Ranking de partidas por nivel y orden
- Selección de dificultad (tres niveles)
- Página de contacto con validación y envío por mailto
- Estética cuidada: colores cálidos, animaciones, botones con íconos
- Accesibilidad y experiencia profesional

## Estructura del proyecto

- `index.html` — Juego principal
- `contacto.html` — Página de contacto
- `css/estilos.css` — Estilos principales
- `js/juego.js` — Lógica del juego
- `js/contacto.js` — Lógica del formulario de contacto
- `img/` — Imágenes e íconos
- `.gitignore` — Buenas prácticas para evitar archivos innecesarios
- `README.md` — Este archivo
- `Minesweeper-Requeriments.pdf` — Requerimientos detallados

## Instalación y uso local

1. Clona el repositorio:
   ```sh
   git clone https://github.com/MateoSforza/D.A.W.git
   ```
2. Abre `index.html` en tu navegador preferido.

## Tecnologías utilizadas
- HTML5
- CSS3
- JavaScript ES5

## Créditos
- Inspirado en minesweeper.online
- Desarrollado por Mateo Sforza para DAW 2025

---

> Para más detalles sobre reglas y requerimientos, ver el archivo `Minesweeper-Requeriments.pdf`. 