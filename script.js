// Evita el desplazamiento del navegador al presionar teclas
document.addEventListener("keydown", (e) => {
  if (["ArrowUp", "ArrowLeft", "ArrowRight"].includes(e.key)) {
    e.preventDefault();
  }
});

// === Variables principales === //
const lua = document.getElementById('luaSprite');
let posX = 100;
let posY = 690; // 🔹 Ajustamos para que inicie bien
const step = 5;
let keys = {}; 
let enElAire = false; 
let velocidad = 7; // 🔹 Ajustamos velocidad de salto
const gravedad = 5;
const suelo = 725; // 🔹 Nivel del suelo

document.addEventListener('keydown', (e) => {
  keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
  keys[e.key] = false;
  if (!enElAire) lua.src = 'img/lua_idle.png';
});

// === Movimiento lateral === //
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

// === Gravedad aplicada === //
function aplicarGravedad() {
  let plataformaDetectada = detectarColisionPlataforma();

  if (!plataformaDetectada && posY < suelo) {
    enElAire = true;
    posY += gravedad;
    lua.style.top = `${posY}px`;
  } else if (plataformaDetectada) {
    enElAire = false;
    posY = plataformaDetectada - lua.offsetHeight; // 🔹 Ajusta Lua sobre la plataforma
    lua.style.top = `${posY}px`;
  } else if (posY >= suelo) {
    enElAire = false;
    posY = suelo;
    lua.style.top = `${posY}px`;
  }

  requestAnimationFrame(aplicarGravedad);
}

aplicarGravedad();

// === Detección de colisión con plataformas === //
const plataformas = document.querySelectorAll(".plataforma");

function detectarColisionPlataforma() {
  for (let plataforma of plataformas) {
    let platTop = plataforma.offsetTop;
    let platLeft = plataforma.offsetLeft;
    let platRight = platLeft + plataforma.offsetWidth;

    let luaBottom = lua.offsetTop + lua.offsetHeight;
    let luaCenterX = lua.offsetLeft + (lua.offsetWidth / 2);

    // 🔹 Detecta colisión solo si Lua está cayendo
    if (enElAire && luaBottom >= platTop && luaBottom <= platTop + 5 && 
        luaCenterX >= platLeft && luaCenterX <= platRight) {
        
        return platTop; // 🔹 Devuelve la posición exacta de la plataforma
    }
  }
  return null;
}

// === Función de salto === //
function saltar() {
  if (!enElAire) {
    enElAire = true;
    lua.src = 'img/lua_pre_jump.png';

    setTimeout(() => {
      lua.src = 'img/lua_jump.png';
    }, 100);

    let alturaMaxima = posY - 90; // 🔹 Ajustamos la altura del salto

    let subida = setInterval(() => {
      if (posY > alturaMaxima) {
        posY -= velocidad;
        lua.style.top = `${posY}px`;
      } else {
        clearInterval(subida);
        lua.src = 'img/lua_post_jump.png';

        let bajada = setInterval(() => {
          let plataformaDetectada = detectarColisionPlataforma();

          if (plataformaDetectada) {
            posY = plataformaDetectada - lua.offsetHeight;
            lua.style.top = `${posY}px`;
            enElAire = false;
            clearInterval(bajada);
            lua.src = 'img/lua_idle.png';
          } else if (posY < suelo) {
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

// === Controles táctiles === //
document.getElementById('btnIzquierda').addEventListener('touchstart', () => keys['ArrowLeft'] = true);
document.getElementById('btnDerecha').addEventListener('touchstart', () => keys['ArrowRight'] = true);
document.getElementById('btnSalto').addEventListener('touchstart', () => saltar());

document.getElementById('btnIzquierda').addEventListener('touchend', () => keys['ArrowLeft'] = false);
document.getElementById('btnDerecha').addEventListener('touchend', () => keys['ArrowRight'] = false);

document.addEventListener('keydown', (e) => {
  if (e.key === "ArrowUp") saltar();
});
