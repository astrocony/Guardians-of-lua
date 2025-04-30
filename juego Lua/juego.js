// === Movimiento de Lua === //
const lua = document.getElementById('luaSprite');
let posX = 100;
const step = 5;
let keys = {}; 
let enElAire = false; 
let velocidad = 10;
const suelo = 720;
lua.style.top = `${suelo}px`;
const plataformas = document.querySelectorAll(".plataforma");




document.addEventListener("keydown", (e) => {
  if (["ArrowUp", "ArrowLeft", "ArrowRight"].includes(e.key)) {
    e.preventDefault(); // Evita el desplazamiento de la página
  }
});

document.addEventListener('keydown', (e) => {   //e.key es que tecla esta presionada
  keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
  keys[e.key] = false;
  if (!enElAire) lua.src = '/img/lua_idle.png';
});

/*

function detectarColisionPlataforma() {
  for (let plataforma of plataformas) {
    let platTop = plataforma.offsetTop;
    let platLeft = plataforma.offsetLeft;
    let platRight = platLeft + plataforma.offsetWidth;
    let luaBottom = parseInt(lua.style.top) + lua.offsetHeight;
    let luaCenterX = parseInt(lua.style.left) + (lua.offsetWidth / 2);
    if (luaBottom >= platTop && luaBottom <= platTop + 5 &&
        luaCenterX >= platLeft && luaCenterX <= platRight) {
      return platTop;
    }
  }
  return null;
}

function aplicarGravedad() {
  let plataformaDetectada = detectarColisionPlataforma();
  if (plataformaDetectada !== null) {
    posY = plataformaDetectada - lua.offsetHeight;
    lua.style.top = `${posY}px`;
    enElAire = false;
  } else if (posY < suelo) {
    posY += 5;
    lua.style.top = `${posY}px`;
  } else {
    enElAire = false;
  }
  requestAnimationFrame(aplicarGravedad);
}

*/ 

function moverLua() {
  let moviendo = false;
  if (keys['ArrowRight'] && posX < 730) {
    posX += step;
    lua.style.left = `${posX}px`;
    lua.src = '/img/lua_step.png'; 
    lua.style.transform = 'scaleX(1)'; 
    moviendo = true;
  }
  if (keys['ArrowLeft'] && posX > 0) {
    posX -= step;
    lua.style.left = `${posX}px`;
    lua.src = '/img/lua_step.png';
    lua.style.transform = 'scaleX(-1)';
    moviendo = true;
  }
  if (!moviendo && !enElAire) {
    lua.src = '/img/lua_idle.png';
  }
  requestAnimationFrame(moverLua);
}

/*

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
        let bajada = setInterval(() => {
          let plataformaDetectada = detectarColisionPlataforma();
          if (plataformaDetectada !== null) {
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


*/

function saltar() {
  if (!enElAire) {  /* OJO: Se define en el aire cuando NO esta en el suelo, no en una superficie  */
    enElAire = true;
    lua.src = '/img/lua_pre_jump.png';

    setTimeout(() => {
      lua.src = '/img/lua_jump.png';
    }, 100);

    let alturaMaxima = suelo - 120; /* la altura del salto esta con respecto al suelo, no una superficie */ 

    let subida = setInterval(() => {   /* setINTERVAL es como un while, pero lo repite cada 20ms */
      let posicionActual = parseInt(lua.style.top) || suelo;

      if (posicionActual > alturaMaxima) {
        lua.style.top = `${posicionActual - velocidad}px`;
      } else {
        clearInterval(subida);
        lua.src = '/img/lua_post_jump.png';

        let bajada = setInterval(() => {
          let posicionActual = parseInt(lua.style.top) || suelo;
          
          if (posicionActual < suelo) {
            lua.style.top = `${posicionActual + velocidad}px`;
            if (keys['ArrowRight'] && posX < 730) {
              posX += step;
              lua.style.left = `${posX}px`;
              lua.style.transform = 'scaleX(1)';
            }
            if (keys['ArrowLeft'] && posX > 0) {
              posX -= step;
              lua.style.left = `${posX}px`;
              lua.style.transform = 'scaleX(-1)';
            }
          } else {
            clearInterval(bajada);
            enElAire = false;
            lua.src = '/img/lua_idle.png';
          }
        }, 20);
      }
    }, 20);
  }
}



document.getElementById('btnIzquierda').addEventListener('touchstart', () => keys['ArrowLeft'] = true);
document.getElementById('btnDerecha').addEventListener('touchstart', () => keys['ArrowRight'] = true);
document.getElementById('btnSalto').addEventListener('touchstart', () => saltar());

document.getElementById('btnIzquierda').addEventListener('touchend', () => keys['ArrowLeft'] = false);
document.getElementById('btnDerecha').addEventListener('touchend', () => keys['ArrowRight'] = false);

document.addEventListener('keydown', (e) => {
  if (e.key === "ArrowUp") saltar();
});

moverLua();
aplicarGravedad();