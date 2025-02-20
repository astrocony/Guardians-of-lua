document.addEventListener("keydown", (e) => {
  if (["ArrowUp", "ArrowLeft", "ArrowRight"].includes(e.key)) {
    e.preventDefault(); // Evita el desplazamiento de la página
  }
});


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






const saltarBtn = document.getElementById('saltarBtn');
let enElAire = false; // Variable para evitar doble salto

function saltar() {
  if (!enElAire) {  // Si no está en el aire, permite el salto
    enElAire = true;
    lua.src = 'lua_salto.png'; // Cambia a sprite de salto

    let alturaInicial = posY;
    let alturaMaxima = alturaInicial - 80; // Define la altura del salto

    // Subir
    let subida = setInterval(() => {
      if (posY > alturaMaxima) {
        posY -= 5;
        lua.style.top = `${posY}px`;
      } else {
        clearInterval(subida);
        
        // Bajar
        let bajada = setInterval(() => {
          if (posY < alturaInicial) {
            posY += 5;
            lua.style.top = `${posY}px`;
          } else {
            clearInterval(bajada);
            enElAire = false;
            lua.src = 'lua_idle.png'; // Vuelve al sprite original
          }
        }, 20);
      }
    }, 20);
  }
}

// Eventos para activar el salto
saltarBtn.addEventListener('click', saltar);
document.addEventListener('keydown', (e) => {
  if (e.key === "ArrowUp") saltar();
});


