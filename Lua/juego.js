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

let modoDefensa = false;
let mirandoDerecha = true;  // para saber a qué lado mira Lua
let ataqueEnProgreso = false;



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



document.addEventListener('keydown', (e) => {
  if (e.key === 'w' || e.key === 'W') {
    modoDefensa = true;
  }

  if ((e.key === 'a' || e.key === 'A') && !ataqueEnProgreso) {
    ataqueEnProgreso = true;
    let secuencia = [
      '/img/lua_ataque1.png',
      '/img/lua_ataque2.png',
      '/img/lua_ataque3.png'
    ];
    let i = 0;
    let animarAtaque = setInterval(() => {
      lua.src = secuencia[i];
      lua.style.transform = mirandoDerecha ? 'scaleX(1)' : 'scaleX(-1)';
      i++;
      if (i >= secuencia.length) {
        clearInterval(animarAtaque);
        ataqueEnProgreso = false;
        if (modoDefensa) {
          lua.src = '/img/lua_defensa1.png';
        } else {
          lua.src = '/img/lua_idle.png';
        }
      }
    }, 250);
  }
});

document.addEventListener('keyup', (e) => {
  if (e.key === 'w' || e.key === 'W') {
    modoDefensa = false;
  }
});






function moverLua() {
  let moviendo = false;

  if (keys['ArrowRight'] && posX < 730) {
    if (modoDefensa || ataqueEnProgreso) {
      // Si está en defensa o ataque, RETROCEDE mirando izquierda
      posX += step;
      lua.style.left = `${posX}px`;
      lua.src = modoDefensa ? '/img/lua_defensa2.png' : lua.src; // opcional cambiar sprite
      lua.style.transform = mirandoDerecha ? 'scaleX(1)' : 'scaleX(-1)'; // NO CAMBIA dirección
    } else {
      // Movimiento normal
      posX += step;
      lua.style.left = `${posX}px`;
      lua.src = '/img/lua_step.png';
      lua.style.transform = 'scaleX(1)';
      mirandoDerecha = true;
    }
    moviendo = true;
  }
  
  if (keys['ArrowLeft'] && posX > 0) {
    if (modoDefensa || ataqueEnProgreso) {
      // Si está en defensa o ataque, RETROCEDE mirando derecha
      posX -= step;
      lua.style.left = `${posX}px`;
      lua.src = modoDefensa ? '/img/lua_defensa2.png' : lua.src; // opcional cambiar sprite
      lua.style.transform = mirandoDerecha ? 'scaleX(1)' : 'scaleX(-1)'; // NO CAMBIA dirección
    } else {
      // Movimiento normal
      posX -= step;
      lua.style.left = `${posX}px`;
      lua.src = '/img/lua_step.png';
      lua.style.transform = 'scaleX(-1)';
      mirandoDerecha = false;
    }
    moviendo = true;
  }
  

  
  if (!moviendo && !enElAire && !modoDefensa && !ataqueEnProgreso) {
    lua.src = '/img/lua_idle.png';
  }

  if (!moviendo && modoDefensa && !enElAire) {
    lua.src = '/img/lua_defensa1.png'; // sprite defensa quieta
  }

  // === Nueva parte: revisar si debería caer ===
  if (!enElAire) {
    let nuevaY = detectarColisionPlataforma();
    if (nuevaY === null && parseInt(lua.style.top) < suelo) {
      // No está sobre ninguna plataforma → comienza a caer
      enElAire = true;

      let bajada = setInterval(() => {
        let posicionActual = parseInt(lua.style.top);
        let nuevaY = detectarColisionPlataforma();

        if (nuevaY !== null) {
          lua.style.top = `${nuevaY}px`;
          clearInterval(bajada);
          enElAire = false;
          if (modoDefensa) {
            lua.src = '/img/lua_defensa1.png';
          } else {
            lua.src = '/img/lua_idle.png';
          }
        } else if (posicionActual < suelo) {
          lua.style.top = `${posicionActual + velocidad}px`;
        } else {
          lua.style.top = `${suelo}px`;
          clearInterval(bajada);
          enElAire = false;
          if (modoDefensa) {
            lua.src = '/img/lua_defensa1.png';
          } else {
            lua.src = '/img/lua_idle.png';
          }
        }
      }, 20);
    }
  }

  requestAnimationFrame(moverLua);
}



/* ----- saltar ---- */ 

function saltar() {
  if (!enElAire) {  // Solo puede saltar si no está en el aire
    enElAire = true;
    lua.src = '/img/lua_pre_jump.png';

    setTimeout(() => {
      lua.src = '/img/lua_jump.png';
    }, 100);

    let alturaMaxima = parseInt(lua.style.top) - 120;  // Salto relativo a la posición actual
    let subida = setInterval(() => {
      let posicionActual = parseInt(lua.style.top);

      if (posicionActual > alturaMaxima) {
        lua.style.top = `${posicionActual - velocidad}px`;
      } else {
        clearInterval(subida);
        lua.src = '/img/lua_post_jump.png';

        let bajada = setInterval(() => {
          let posicionActual = parseInt(lua.style.top);
          let nuevaY = detectarColisionPlataforma();

          if (nuevaY !== null) {
            lua.style.top = `${nuevaY}px`;
            clearInterval(bajada);
            enElAire = false;
            lua.src = '/img/lua_idle.png';
          } else if (posicionActual < suelo) {
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
            lua.style.top = `${suelo}px`;
            clearInterval(bajada);
            enElAire = false;
            lua.src = '/img/lua_idle.png';
          }
        }, 20);
      }
    }, 20);
  }
}




/* ------- Colisioones ------ */



function detectarColisionPlataforma() {
  const luaTop = parseInt(lua.style.top) || suelo;
  const luaBottom = luaTop + lua.offsetHeight;
  const luaCenterX = posX + lua.offsetWidth / 2;

  for (let plataforma of plataformas) {
    const platTop = plataforma.offsetTop;
    const platLeft = plataforma.offsetLeft;
    const platRight = platLeft + plataforma.offsetWidth;

    const colisionHorizontal = luaCenterX >= platLeft && luaCenterX <= platRight;
    const colisionVertical = luaBottom >= platTop && luaBottom <= platTop + 10;

    if (colisionHorizontal && colisionVertical) {
      return platTop - lua.offsetHeight;
    }
  }
  return null;
}


/* -------touch botones (creo)------ */



document.getElementById('btnIzquierda').addEventListener('touchstart', () => keys['ArrowLeft'] = true);
document.getElementById('btnDerecha').addEventListener('touchstart', () => keys['ArrowRight'] = true);
document.getElementById('btnSalto').addEventListener('touchstart', () => saltar());

document.getElementById('btnIzquierda').addEventListener('touchend', () => keys['ArrowLeft'] = false);
document.getElementById('btnDerecha').addEventListener('touchend', () => keys['ArrowRight'] = false);

document.addEventListener('keydown', (e) => {
  if (e.key === "ArrowUp") saltar();
});

moverLua();
/*aplicarGravedad(); */


/* ------------ SONIDO ----------- */


/* --- background -----*/

let musicaIniciada = false;

window.addEventListener('keydown', (e) => {
  if (!musicaIniciada && ['ArrowLeft', 'ArrowRight', 'ArrowUp', ' '].includes(e.key)) {
    const music = document.getElementById('bg-music');
    music.play().then(() => {
      console.log("🎵 Música iniciada con una tecla");
    }).catch((err) => {
      console.warn("🚫 Bloqueo de sonido:", err);
    });
    musicaIniciada = true;
  }
});

/* ---- salto y caminata ---- */

// === SONIDOS DE LUA === //
const sonidoPaso = new Audio("/img/audios/paso_lua2.mp3");
const sonidoSalto = new Audio("/img/audios/salto_lua.mp3");

function reproducirPaso() {
  // Clonamos el audio para que pueda sonar aunque el anterior no haya terminado
  const paso = sonidoPaso.cloneNode();
  paso.play();
}

function reproducirSalto() {
  const salto = sonidoSalto.cloneNode();
  salto.play();
}

// Escuchar teclas
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
    reproducirPaso();
  }
  if (e.key === "ArrowUp") {
    reproducirSalto();
  }
});








