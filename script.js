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

let indiceMensaje = 0;

function cambiarMensaje() {
  const mensajeElemento = document.getElementById('mensaje');
  mensajeElemento.innerText = mensajes[indiceMensaje];
  mensajeElemento.style.color = "#7b1fa2";
  mensajeElemento.style.fontSize = "22px";
  indiceMensaje = (indiceMensaje + 1) % mensajes.length;
}

// === Movimiento de Lua === //
const lua = document.getElementById('luaSprite');
let posX = 100;
const step = 5;
let keys = {}; 
let enElAire = false; 

document.addEventListener('keydown', (e) => {
  keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
  keys[e.key] = false;
  if (!enElAire) lua.src = 'img/lua_idle.png';
});

// === Movimiento continuo === //
function moverLua() {
  let moviendo = false;

  if (keys['ArrowRight'] && posX < 730) {
    posX += step;
    lua.style.left = `${posX}px`;
    lua.src = 'img/lua_step.png'; 
    lua.style.transform = 'scaleX(1)'; 
    moviendo = true;
  }

  if (keys['ArrowLeft'] && posX > 0) {
    posX -= step;
    lua.style.left = `${posX}px`;
    lua.src = 'img/lua_step.png';
    lua.style.transform = 'scaleX(-1)';
    moviendo = true;
  }

  if (!moviendo && !enElAire) {
    lua.src = 'img/lua_idle.png';
  }

  requestAnimationFrame(moverLua);
}

moverLua(); 


// === Definir la posición inicial de Lua en el suelo === //
window.onload = function() {
  lua.style.top = "300px"; 
};

const suelo = 300; // Posición fija del suelo

function saltar() {
  if (!enElAire) {
    enElAire = true;
    lua.src = 'img/lua_pre_jump.png';

    setTimeout(() => {
      lua.src = 'img/lua_jump.png';
    }, 100);

    let alturaMaxima = suelo - 80; // Define la altura máxima del salto
    let velocidad = 10; // Controla la velocidad del salto

    let subida = setInterval(() => {
      let posicionActual = parseInt(lua.style.top) || suelo;

      if (posicionActual > alturaMaxima) {
        lua.style.top = `${posicionActual - velocidad}px`;
      } else {
        clearInterval(subida);
        lua.src = 'img/lua_post_jump.png';

        let bajada = setInterval(() => {
          let posicionActual = parseInt(lua.style.top) || suelo;

          if (posicionActual < suelo) {
            lua.style.top = `${posicionActual + velocidad}px`;
          } else {
            clearInterval(bajada);
            enElAire = false;
            lua.src = 'img/lua_idle.png';
          }
        }, 10); // Baja más rápido
      }
    }, 10); // Sube más rápido
  }
}

// === Agregar eventos de teclado y táctiles para salto === //
document.addEventListener('keydown', (e) => {
  if (e.key === "ArrowUp") saltar();
});

document.getElementById('btnSalto').addEventListener('touchstart', saltar);

