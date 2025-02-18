// === Función de Mensajes === //
const mensajes = [
  "¿Estás perdido? Pronto encontrarás la Luz",
  "Una estrella hay al final del túnel esperándote",
  "Sigue creyendo, estás muy cerca",
  "Necesitas descansar un poco y todo te encontrará",
  "¡Una estrella te encontrará!"
];

// Índice para recorrer los mensajes
let indiceMensaje = 0;

function cambiarMensaje() {
  const mensajeElemento = document.getElementById('mensaje');
  mensajeElemento.innerText = mensajes[indiceMensaje];
  mensajeElemento.style.color = "#7b1fa2";
  mensajeElemento.style.fontSize = "22px";
  indiceMensaje = (indiceMensaje + 1) % mensajes.length;
}

// === Función de Movimiento de Lua (Con tus sprites) === //
const lua = document.getElementById('luaSprite');
let posX = 100;
const step = 5;
let keys = {}; // Teclas presionadas

// Evento para presionar tecla
document.addEventListener('keydown', (e) => {
  keys[e.key] = true;
});

// Evento para soltar tecla
document.addEventListener('keyup', (e) => {
  keys[e.key] = false;
  lua.src = 'img/lua_idle.png'; // Sprite de reposo
});

// === Bucle de Movimiento Continuo === //
function moverLua() {
  let moviendo = false;

  if (keys['ArrowRight'] && posX < 730) {
    posX += step;
    lua.style.left = `${posX}px`;
    lua.src = 'img/lua_step.png'; // Sprite caminando
    lua.style.transform = 'scaleX(1)'; // Mirando a la derecha
    moviendo = true;
  }

  if (keys['ArrowLeft'] && posX > 0) {
    posX -= step;
    lua.style.left = `${posX}px`;
    lua.src = 'img/lua_step.png'; // Sprite caminando
    lua.style.transform = 'scaleX(-1)'; // Mirando a la izquierda
    moviendo = true;
  }

  if (!moviendo) {
    lua.src = 'img/lua_idle.png'; // Quieto si no hay movimiento
  }

  requestAnimationFrame(moverLua);
}

moverLua(); // Inicia animación


// === Control táctil para móviles === //
const btnIzquierda = document.getElementById('btnIzquierda');
const btnDerecha = document.getElementById('btnDerecha');

// Cuando tocan los botones (touchstart), se mueve
btnIzquierda.addEventListener('touchstart', () => keys['ArrowLeft'] = true);
btnDerecha.addEventListener('touchstart', () => keys['ArrowRight'] = true);

// Cuando sueltan el botón (touchend), se detiene
btnIzquierda.addEventListener('touchend', () => keys['ArrowLeft'] = false);
btnDerecha.addEventListener('touchend', () => keys['ArrowRight'] = false);

