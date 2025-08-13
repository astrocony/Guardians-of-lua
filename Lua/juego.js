// === Estado global / setup === //
let gameStarted = false; // <<< nuevo: el juego parte bloqueado

// === Movimiento de Lua === //
const lua = document.getElementById('luaSprite');
const items = document.querySelectorAll(".item");
let posX = 100;
const step = 5;
let keys = {}; 
let enElAire = false; 
let velocidad = 10;
const suelo = 690;
lua.style.top = `${suelo}px`;
lua.style.left = `${posX}px`;

const plataformas = document.querySelectorAll(".plataforma");

let modoDefensa = false;
let mirandoDerecha = true;  // para saber a qué lado mira Lua
let ataqueEnProgreso = false;

const sonidoAtaque = new Audio("/img/audios/espada_lua.mp3");

// === Loop principal === //
function moverLua() {
  let moviendo = false;

  if (keys['ArrowRight'] && posX < 730) {
    if (modoDefensa || ataqueEnProgreso) {
      posX += step;
      lua.style.left = `${posX}px`;
      lua.src = modoDefensa ? '/img/lua_defensa2.png' : lua.src;
      lua.style.transform = mirandoDerecha ? 'scaleX(1)' : 'scaleX(-1)';
    } else {
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
      posX -= step;
      lua.style.left = `${posX}px`;
      lua.src = modoDefensa ? '/img/lua_defensa2.png' : lua.src;
      lua.style.transform = mirandoDerecha ? 'scaleX(1)' : 'scaleX(-1)';
    } else {
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
    lua.src = '/img/lua_defensa1.png';
  }

  if (!enElAire) {
    let nuevaY = detectarColisionPlataforma();
    if (nuevaY === null && parseInt(lua.style.top) < suelo) {
      enElAire = true;
      let bajada = setInterval(() => {
        let posicionActual = parseInt(lua.style.top);
        let nuevaY = detectarColisionPlataforma();

        if (nuevaY !== null) {
          lua.style.top = `${nuevaY}px`;
          clearInterval(bajada);
          enElAire = false;
          lua.src = modoDefensa ? '/img/lua_defensa1.png' : '/img/lua_idle.png';
        } else if (posicionActual < suelo) {
          lua.style.top = `${posicionActual + velocidad}px`;
        } else {
          lua.style.top = `${suelo}px`;
          clearInterval(bajada);
          enElAire = false;
          lua.src = modoDefensa ? '/img/lua_defensa1.png' : '/img/lua_idle.png';
        }
      }, 20);
    }
  }

  actualizarCamara();
  detectarColisionItems();
  requestAnimationFrame(moverLua);
}

// -------  atacar y defender ------- //
function setDefensa(activa) {
  modoDefensa = !!activa;
  if (!enElAire && !ataqueEnProgreso) {
    lua.src = activa ? '/img/lua_defensa1.png' : '/img/lua_idle.png';
  }
}

function atacar(modo) {
  // versión simple: dispara una secuencia por toque/tecla
  if (modo === true) {
    if (ataqueEnProgreso) return;

    sonidoAtaque.cloneNode().play();
    ataqueEnProgreso = true;

    const secuencia = [
      '/img/lua_ataque1.png',
      '/img/lua_ataque2.png',
      '/img/lua_ataque3.png'
    ];
    let i = 0;

    const animarAtaque = setInterval(() => {
      lua.src = secuencia[i];
      lua.style.transform = mirandoDerecha ? 'scaleX(1)' : 'scaleX(-1)';
      i++;
      if (i >= secuencia.length) {
        clearInterval(animarAtaque);
        ataqueEnProgreso = false;
        lua.src = modoDefensa ? '/img/lua_defensa1.png' : '/img/lua_idle.png';
      }
    }, 250);
  }
  // si quieres ataque continuo al dejar presionado, después lo hacemos bien con interval
}

// ----- Cámara ----- //
const viewportWidth = 600;   // el tamaño visible de la pantalla
const escenarioWidth = 800;  // el tamaño total del escenario

let camaraX = 0;

function actualizarCamara() {
  let objetivoX = posX - (viewportWidth / 2); // normal
  const margen = 250;
  const limiteIzquierdo = camaraX + margen;
  const limiteDerecho = camaraX + viewportWidth - margen;

  if (posX < limiteIzquierdo) {
    camaraX = Math.max(0, posX - margen);
  } else if (posX > limiteDerecho) {
    camaraX = Math.min(escenarioWidth - viewportWidth, posX - viewportWidth + margen);
  }
  document.getElementById('escenario').style.transform = `translate(${-camaraX}px, 0px)`;
}

// ----- Saltar ----- //
function saltar() {
  if (!enElAire) {
    enElAire = true;
    lua.src = '/img/lua_pre_jump.png';

    setTimeout(() => {
      lua.src = '/img/lua_jump.png';
    }, 100);

    let alturaMaxima = parseInt(lua.style.top) - 120;
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

// ------- Colisiones plataforma ------ //
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

// --------- Items ------- //
let cuentaPajaros = 0;
let cuentaCorazones = 0;

let sonidoCorazon = new Audio("/img/audios/tum_tum_heart.mp3");
let sonidoPajaro = new Audio("/img/audios/sonido_item_general.mp3");

function detectarColisionItems() {
  const luaRect = lua.getBoundingClientRect();

  items.forEach((item) => {
    if (item.style.display === 'none') return;

    const itemRect = item.getBoundingClientRect();

    const colision = !(luaRect.right < itemRect.left ||
                       luaRect.left > itemRect.right ||
                       luaRect.bottom < itemRect.top ||
                       luaRect.top > itemRect.bottom);

    if (colision) {
      item.style.display = 'none';

      if (item.dataset.tipo === 'pajaro') {
        cuentaPajaros++;
        document.getElementById('contadorPajaros').textContent = ` x ${cuentaPajaros}`;
        sonidoPajaro.cloneNode().play();
      } else if (item.dataset.tipo === 'corazon') {
        cuentaCorazones++;
        document.getElementById('contadorCorazones').textContent = ` x ${cuentaCorazones}`;
        sonidoCorazon.cloneNode().play();
      }
    }
  });
}

// ------ Teclado (con bloqueo) ------ //
// Evita scroll con flechas SIEMPRE
document.addEventListener("keydown", (e) => {
  if (["ArrowUp", "ArrowLeft", "ArrowRight"].includes(e.key)) {
    e.preventDefault();
  }
});

// Movimiento por flechas
document.addEventListener('keydown', (e) => {
  if (!gameStarted) return; // <<< bloqueo
  keys[e.key] = true;
});
document.addEventListener('keyup', (e) => {
  if (!gameStarted) return; // <<< bloqueo
  keys[e.key] = false;
  if (!enElAire) lua.src = '/img/lua_idle.png';
});

// Ataque/Defensa por teclado
document.addEventListener('keydown', (e) => {
  if (!gameStarted) return; // <<< bloqueo
  if (e.key === 'w' || e.key === 'W') setDefensa(true);
  if (e.key === 'a' || e.key === 'A') atacar(true);
});
document.addEventListener('keyup', (e) => {
  if (!gameStarted) return; // <<< bloqueo
  if (e.key === 'w' || e.key === 'W') setDefensa(false);
});
document.addEventListener('keydown', (e) => {
  if (!gameStarted) return; // <<< bloqueo
  if (e.key === "ArrowUp") saltar();
});

// ------ Touch (con bloqueo) ------ //
const $ = (id) => document.getElementById(id);

$('btnIzquierda').addEventListener('touchstart', (e) => { if (!gameStarted) return; keys['ArrowLeft'] = true; });
$('btnDerecha').addEventListener('touchstart',   (e) => { if (!gameStarted) return; keys['ArrowRight'] = true; });
$('btnSalto').addEventListener('touchstart',     (e) => { if (!gameStarted) return; saltar(); });

$('btnSalto_left').addEventListener('touchstart',  (e) => { if (!gameStarted) return; keys['ArrowLeft']=true; saltar(); });
$('btnSalto_right').addEventListener('touchstart', (e) => { if (!gameStarted) return; keys['ArrowRight']=true; saltar(); });

$('btn_a').addEventListener('touchstart', (e) => { if (!gameStarted) return; atacar(true); });
$('btn_a').addEventListener('touchend',   (e) => { if (!gameStarted) return; /* ataque simple: nada al soltar */ });

$('btn_w').addEventListener('touchstart', (e) => { if (!gameStarted) return; setDefensa(true); });
$('btn_w').addEventListener('touchend',   (e) => { if (!gameStarted) return; setDefensa(false); });

$('btnIzquierda').addEventListener('touchend', (e) => { if (!gameStarted) return; keys['ArrowLeft'] = false; });
$('btnDerecha').addEventListener('touchend',   (e) => { if (!gameStarted) return; keys['ArrowRight'] = false; });
$('btnSalto_left').addEventListener('touchend',(e) => { if (!gameStarted) return; keys['ArrowLeft'] = false; });
$('btnSalto_right').addEventListener('touchend',(e)=> { if (!gameStarted) return; keys['ArrowRight'] = false; });

// ------------ SONIDO ----------- //
let musicaIniciada = false;
window.addEventListener('keydown', (e) => {
  if (!gameStarted) return; // <<< no arranca música antes
  if (!musicaIniciada && ['ArrowLeft', 'ArrowRight', 'ArrowUp', ' '].includes(e.key)) {
    const music = document.getElementById('bg-music');
    music.play().catch(() => {});
    musicaIniciada = true;
  }
});

// === Efectos pasos/salto === //
const sonidoPaso = new Audio("/img/audios/paso_lua2.mp3");
const sonidoSalto = new Audio("/img/audios/salto_lua.mp3");

function reproducirPaso() {
  const paso = sonidoPaso.cloneNode();
  paso.play();
}
function reproducirSalto() {
  const salto = sonidoSalto.cloneNode();
  salto.play();
}

document.addEventListener("keydown", (e) => {
  if (!gameStarted) return; // <<< bloqueo
  if (e.key === "ArrowLeft" || e.key === "ArrowRight") reproducirPaso();
  if (e.key === "ArrowUp") reproducirSalto();
});

// ---- auto-zoom móvil ---- //
function fitGameMobile() {
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  const root = document.getElementById('contenedor-principal');
  if (!root) return;

  const BASE = 1000;
  const CONTROLS_H = 140;
  const availW = window.innerWidth;
  const availH = Math.max(0, window.innerHeight - CONTROLS_H);

  const s = isMobile ? 0.62 : 1;
  root.style.transform = `scale(${s})`;
  root.style.transformOrigin = 'top left';
}
window.addEventListener('load', fitGameMobile);
window.addEventListener('resize', fitGameMobile);
window.addEventListener('orientationchange', fitGameMobile);

// --------- BLOQUEO INICIAL --------- //
// al cargar: bloquear (clase en body) y NO iniciar moverLua()
window.addEventListener('load', () => {
  document.body.classList.add('modal-open'); // CSS bloqueará clicks y gestos al juego
});

// al pulsar OK: desbloquea, oculta modal y arranca el loop
const okBtn = document.getElementById('btnOK');
okBtn?.addEventListener('click', () => {
  document.body.classList.remove('modal-open');
  document.getElementById('modal-inicio').style.display = 'none';
  gameStarted = true;     // <<< ahora sí aceptamos entradas
  moverLua();             // <<< arrancamos el loop

});



//------- Show Screen information player (VER) ------ //

let playerName="";
let playerAvatar="";


const avatars = document.querySelectorAll('.avatar');

avatars.forEach(avatar => {
  avatar.addEventListener('click', () => {
    avatars.forEach(a => a.classList.remove('seleccionado')); // quita de todos
    avatar.classList.add('seleccionado'); // pone en el que clickeaste
  });
});



okBtn.addEventListener('click',()=>{
  playerName=document.getElementById('playerName').value; 
  playerAvatar=document.querySelector('.avatar.seleccionado img')?.src;

  mostrarJugadorEnPantalla();

});

//------ function mostrar en pantalla ------//

function mostrarJugadorEnPantalla() {
  document.getElementById('playerDisplayName').textContent = playerName;
  document.getElementById('playerIcon').src = playerAvatar;
}