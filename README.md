# Buscaminas TP Final

## Descripción
Juego de Buscaminas desarrollado como trabajo práctico final para la materia Desarrollo de Aplicaciones Web.

## Características
- ✅ **Modo oscuro/claro** con persistencia en localStorage
- ✅ **Tres niveles de dificultad**: Fácil (8x8, 10 minas), Medio (12x12, 25 minas), Difícil (16x16, 40 minas)
- ✅ **Sistema de ranking** con ordenamiento por puntaje y fecha
- ✅ **Cronómetro** y contador de minas
- ✅ **Interfaz responsive** para dispositivos móviles
- ✅ **Validación de formularios** sin uso de alert()
- ✅ **Código modular** separado en archivos específicos
- ✅ **Estilos CSS organizados** alfabéticamente
- ✅ **Funcionalidad completa** sin código bloqueante

## Estructura del Proyecto

```
Buscaminas_FinalWEB/
├── index.html              # Página principal del juego
├── contacto.html           # Página de contacto
├── css/
│   ├── estilos.css        # Estilos principales (propiedades ordenadas)
│   └── reset.css          # Reset CSS
├── js/
│   ├── juego.js           # Lógica principal del juego
│   ├── ui.js              # Funcionalidades de interfaz
│   ├── modo-oscuro.js     # Gestión del modo oscuro
│   └── contacto.js        # Lógica de la página de contacto
└── img/                   # Recursos gráficos
```

## Correcciones Implementadas

### ✅ Contacto no guarda el modo oscuro
- Agregado botón de modo oscuro en `contacto.html`
- Creado archivo `js/modo-oscuro.js` para funcionalidad compartida

### ✅ Se prohíbe el uso de código bloqueante (alert)
- Reemplazado `alert()` con modal personalizado
- Implementado sistema de mensajes no bloqueante

### ✅ Arreglar el orden declarativo de las funciones
- Reorganizado `juego.js` con secciones claras:
  - Variables globales
  - Elementos del DOM
  - Funciones de validación
  - Funciones de configuración
  - Funciones de inicialización
  - Funciones de lógica del juego
  - Funciones de interfaz y utilidades
  - Event listeners

### ✅ Uso de estilos en línea
- Eliminados todos los estilos en línea del HTML
- Movidos a clases CSS específicas
- Propiedades CSS ordenadas alfabéticamente

### ✅ Uso de javascript desde el html
- Separado JavaScript del HTML
- Creado archivo `js/ui.js` para funcionalidades de UI
- Creado archivo `js/modo-oscuro.js` para modo oscuro

### ✅ Se puede ganar con las minas en negativo
- Agregada validación para evitar contador negativo
- Implementada lógica de protección en `colocarBandera()`

### ✅ Ordenar las propiedades del css
- Reorganizadas todas las propiedades CSS en orden alfabético
- Mejorada la legibilidad y mantenibilidad

### ✅ El código JavaScript se puede subdividir en archivos
- `juego.js`: Lógica principal del juego
- `ui.js`: Funcionalidades de interfaz
- `modo-oscuro.js`: Gestión del modo oscuro
- `contacto.js`: Lógica de contacto

## Tecnologías Utilizadas
- HTML5
- CSS3 (con variables CSS)
- JavaScript ES5 (compatibilidad)
- LocalStorage para persistencia

## Autores
- **Marco Portaro** - Desarrollo principal
- **Mateo Sforza** - Contribuciones adicionales

## Instalación
1. Clonar el repositorio
2. Abrir `index.html` en un navegador web
3. ¡Jugar!

## Funcionalidades del Juego
- **Click izquierdo**: Revelar celda
- **Click derecho**: Colocar/quitar bandera
- **Primer click**: Nunca es mina
- **Victoria**: Revelar todas las celdas sin minas
- **Derrota**: Click en mina

## Commits Representativos
- `feat: implementar modo oscuro persistente`
- `fix: eliminar uso de alert() bloqueante`
- `refactor: reorganizar funciones por orden declarativo`
- `style: eliminar estilos en línea y ordenar CSS`
- `fix: prevenir contador de minas negativo`
- `refactor: separar JavaScript en módulos`
- `docs: actualizar README con correcciones` 