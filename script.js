// === Evita el desplazamiento del navegador cuando usas las teclas de flecha === //
document.addEventListener("keydown", (e) => {
  if (["ArrowUp", "ArrowLeft", "ArrowRight"].includes(e.key)) {
    e.preventDefault(); // 🔹 Evita que la página se mueva cuando presionas estas teclas
  }
});

// === 🔥 VARIABLES PRINCIPALES === //
const lua = document.getElementById('luaSprite'); // 🔹 Obtiene el personaje de Lua en el HTML
let posX = 100; // 🔹 Posición inicial en X
let posY = 690; // 🔹 Posición inicial en Y (en el suelo)
const step = 5; // 🔹 Velocidad al moverse lateralmente
let keys = {}; // 🔹 Objeto para detectar qué teclas están presionadas
let enElAire = false; // 🔹 Indica si Lua está en el aire o en una plataforma
let velocidad = 7; // 🔹 Velocidad del salto
const gravedad = 5; // 🔹 Intensidad de la gravedad (hace que Lua caiga)
const suelo = 725; // 🔹 Nivel del suelo (la parte más baja donde Lua puede pararse)

// === 🚀 EVENTOS PARA DETECTAR CUÁNDO SE PRESIONAN Y SUELTAN TECLAS === //
document.addEventListener('keydown', (e) => {
  keys[e.key] = true; // 🔹 Marca la tecla como presionada
});

document.addEventListener('keyup', (e) => {
  keys[e.key] = false; // 🔹 Marca la tecla como liberada
  if (!enElAire) lua.src = 'img/lua_idle.png'; // 🔹 Si no está en el aire, Lua vuelve a su sprite normal
});

// === 🔄 MOVIMIENTO LATERAL === //
function moverLua() {
  let moviendo = false; // 🔹 Para saber si Lua se está moviendo o no

  // 🔹 Mover hacia la derecha
  if (keys['ArrowRight'] && posX < 730) {
    posX += step;
    lua.style.left = `${posX}px`; // 🔹 Cambia la posición X de Lua en la pantalla
    lua.src = 'img/lua_step.png'; // 🔹 Cambia al sprite de caminar
    lua.style.transform = 'scaleX(1)'; // 🔹 Asegura que Lua mire a la derecha
    moviendo = true;
  }

  // 🔹 Mover hacia la izquierda
  if (keys['ArrowLeft'] && posX > 0) {
    posX -= step;
    lua.style.left = `${posX}px`; // 🔹 Cambia la posición X de Lua
    lua.src = 'img/lua_step.png'; // 🔹 Cambia al sprite de caminar
    lua.style.transform = 'scaleX(-1)'; // 🔹 Hace que Lua mire a la izquierda
    moviendo = true;
  }

  // 🔹 Si no se mueve y no está en el aire, Lua vuelve a su sprite normal
  if (!moviendo && !enElAire) {
    lua.src = 'img/lua_idle.png';
  }

  requestAnimationFrame(moverLua); // 🔹 Repite la función para actualizar el movimiento
}

moverLua(); 

// === 🛑 GRAVEDAD (HACE QUE LUA CAIGA CUANDO NO ESTÁ EN UNA PLATAFORMA) === //
function aplicarGravedad() {
  let plataformaDetectada = detectarColisionPlataforma(); // 🔹 Revisa si Lua está en una plataforma
  
  if (!plataformaDetectada && posY < suelo) {
    // 🔹 Si no hay plataforma debajo, Lua sigue cayendo
    enElAire = true;
    posY += gravedad; // 🔹 Aumenta la posición Y para hacerla bajar
    lua.style.top = `${posY}px`;
  } else if (plataformaDetectada) {
    // 🔹 Lua aterriza sobre la plataforma y deja de caer
    enElAire = false;
    posY = plataformaDetectada - lua.offsetHeight;
    lua.style.top = `${posY}px`;
  } else if (posY >= suelo) {
    // 🔹 Lua toca el suelo y se detiene
    enElAire = false;
    posY = suelo;
    lua.style.top = `${posY}px`;
  }

  requestAnimationFrame(aplicarGravedad); // 🔹 Repite la función para mantener la gravedad
}

aplicarGravedad();

// === 🔍 DETECCIÓN DE COLISIÓN CON PLATAFORMAS === //
const plataformas = document.querySelectorAll(".plataforma"); // 🔹 Obtiene todas las plataformas

function detectarColisionPlataforma() {
  for (let plataforma of plataformas) {
    let platTop = plataforma.offsetTop;
    let platLeft = plataforma.offsetLeft;
    let platRight = platLeft + plataforma.offsetWidth;

    let luaBottom = lua.offsetTop + lua.offsetHeight; // 🔹 Calcula la parte baja de Lua
    let luaCenterX = lua.offsetLeft + (lua.offsetWidth / 2); // 🔹 Calcula el centro de Lua en X

    // 🔹 Detecta colisión SOLO si Lua está cayendo y aterriza sobre la plataforma
    if (luaBottom >= platTop && luaBottom <= platTop + 5 && 
        luaCenterX >= platLeft && luaCenterX <= platRight) {
        
        return platTop; // 🔹 Devuelve la altura de la plataforma
    }
  }
  return null; // 🔹 Devuelve null si no hay plataforma debajo
}

// === 🔼 SALTO DE LUA === //
function saltar() {
  if (!enElAire) { // 🔹 Solo puede saltar si no está en el aire
    enElAire = true;
    lua.src = 'img/lua_pre_jump.png';

    setTimeout(() => {
      lua.src = 'img/lua_jump.png';
    }, 100);

    let alturaMaxima = posY - 80; // 🔹 Define cuánto subirá Lua

    let subida = setInterval(() => {
      if (posY > alturaMaxima) {
        posY -= velocidad; // 🔹 Hace que Lua suba
        lua.style.top = `${posY}px`;
      } else {
        clearInterval(subida);
        lua.src = 'img/lua_post_jump.png';

        let bajada = setInterval(() => {
          let plataformaDetectada = detectarColisionPlataforma();

          if (plataformaDetectada) {
            // 🔹 Si hay una plataforma, Lua aterriza sobre ella
            posY = plataformaDetectada - lua.offsetHeight;
            lua.style.top = `${posY}px`;
            enElAire = false;
            clearInterval(bajada);
            lua.src = 'img/lua_idle.png';
          } else if (posY < suelo) {
            // 🔹 Si no hay plataforma, sigue cayendo hasta tocar el suelo
            posY += velocidad;
            lua.style.top = `${posY}px`;
          } else {
            clearInterval(bajada);
            enElAire = false;
            lua.src = 'img/lua_idle.png';
          }
        }, 20);
      }
    }, 20);
  }
}

// === 🎮 CONTROLES TÁCTILES === //
document.getElementById('btnIzquierda').addEventListener('touchstart', () => keys['ArrowLeft'] = true);
document.getElementById('btnDerecha').addEventListener('touchstart', () => keys['ArrowRight'] = true);
document.getElementById('btnSalto').addEventListener('touchstart', () => saltar());

document.getElementById('btnIzquierda').addEventListener('touchend', () => keys['ArrowLeft'] = false);
document.getElementById('btnDerecha').addEventListener('touchend', () => keys['ArrowRight'] = false);

document.addEventListener('keydown', (e) => {
  if (e.key === "ArrowUp") saltar();
});
