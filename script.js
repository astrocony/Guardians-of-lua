// Evita el desplazamiento del navegador al presionar teclas
document.addEventListener("keydown", (e) => {
  if (["ArrowUp", "ArrowLeft", "ArrowRight"].includes(e.key)) {
    e.preventDefault();
  }
});

// === Variables principales === //
const lua = document.getElementById('luaSprite');
let posX = 100;
let posY = 740; // 🔹 Lua empieza más arriba (justo sobre la plataforma baja)
const step = 5;
let keys = {}; 
let enElAire = false; 
let velocidad = 10;
const gravedad = 5;
const suelo = 725; // Nivel del suelo
lua.style.top = `${posY}px`; // 🔹 Forzar la posición inicial correctamente

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

// === Gravedad aplicada === //
function aplicarGravedad() {
  if (!detectandoPlataforma() && posY < suelo) {
    enElAire = true;
    posY += gravedad;
    lua.style.top = `${posY}px`;
  } else {
    enElAire = false;
  }
  requestAnimationFrame(aplicarGravedad);
}

aplicarGravedad();

// === Detección de colisión con plataformas === //
const plataformas = document.querySelectorAll(".plataforma");

function detectandoPlataforma() {
  for (let plataforma of plataformas) {
    let platTop = plataforma.offsetTop;
    let platLeft = plataforma.offsetLeft;
    let platRight = platLeft + plataforma.offsetWidth;

    let luaBottom = lua.offsetTop + lua.offsetHeight;
    let luaCenterX = lua.offsetLeft + (lua.offsetWidth / 2);

    // 🔹 Solo detecta la plataforma si Lua está cayendo sobre ella
    if (luaBottom >= platTop && luaBottom <= platTop + 10 && 
        luaCenterX >= platLeft && luaCenterX <= platRight) {
        
        lua.style.top = `${platTop - lua.offsetHeight}px`;
        enElAire = false;
        return true; 
    }
  }
  return false;
}

// === Función de salto === //
function saltar() {
  if (!enElAire) {
    enElAire = true;
    lua.src = 'img/lua_pre_jump.png';

    setTimeout(() => {
      lua.src = 'img/lua_jump.png';
    }, 100);

    let alturaMaxima = posY - 120;

    let subida = setInterval(() => {
      if (posY > alturaMaxima) {
        posY -= velocidad;
        lua.style.top = `${posY}px`;
      } else {
        clearInterval(subida);
        lua.src = 'img/lua_post_jump.png';

        let bajada = setInterval(() => {
          if (!detectandoPlataforma() && posY < suelo) {
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
