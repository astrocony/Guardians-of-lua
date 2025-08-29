// === Estado global / setup === //
let gameStarted = false; // <<< nuevo: el juego parte bloqueado

// === Movimiento de Lua === //
const lua = document.getElementById('luaSprite');
const portal= document.getElementById('Portal0');

const items = document.querySelectorAll(".item");
let posX = 100;
const step = 5;
let keys = {}; 
let aloft = false; 
let velocity = 10;
const floor = 690;
lua.style.top = `${floor}px`;
lua.style.left = `${posX}px`;

const platforms = document.querySelectorAll(".platform");

let defenseMode = false;
let lookingRight = true;  // para saber a qué lado mira Lua
let attacking = false;

const attackSound = new Audio("/img/audios/espada_lua.mp3");

// === Loop principal === //
function moveLua() {
  let moving = false;

  if (keys['ArrowRight'] && posX < 730) {
    if (defenseMode || attacking) {
      posX += step;
      lua.style.left = `${posX}px`;
      lua.src = defenseMode ? '/img/lua_defensa2.png' : lua.src;
      lua.style.transform = lookingRight ? 'scaleX(1)' : 'scaleX(-1)';
    } else {
      posX += step;
      lua.style.left = `${posX}px`;
      lua.src = '/img/lua_step.png';
      lua.style.transform = 'scaleX(1)';
      lookingRight = true;
    }
    moving = true;
  }

  if (keys['ArrowLeft'] && posX > 0) {
    if (defenseMode || attacking) {
      posX -= step;
      lua.style.left = `${posX}px`;
      lua.src = defenseMode ? '/img/lua_defensa2.png' : lua.src;
      lua.style.transform = lookingRight ? 'scaleX(1)' : 'scaleX(-1)';
    } else {
      posX -= step;
      lua.style.left = `${posX}px`;
      lua.src = '/img/lua_step.png';
      lua.style.transform = 'scaleX(-1)';
      lookingRight = false;
    }
    moving = true;
  }

  if (!moving && !aloft && !defenseMode && !attacking) {
    lua.src = '/img/lua_idle.png';
  }

  if (!moving && defenseMode && !aloft) {
    lua.src = '/img/lua_defensa1.png';
  }

  if (!aloft) {
    let newY = detectPlatformCollision();
    if (newY === null && parseInt(lua.style.top) < floor) {
      aloft = true;
      let descent = setInterval(() => {
        let currentPosition = parseInt(lua.style.top);
        let newY = detectPlatformCollision();

        if (newY !== null) {
          lua.style.top = `${newY}px`;
          clearInterval(descent);
          aloft = false;
          lua.src = defenseMode ? '/img/lua_defensa1.png' : '/img/lua_idle.png';
        } else if (currentPosition < floor) {
          lua.style.top = `${currentPosition + velocity}px`;
        } else {
          lua.style.top = `${floor}px`;
          clearInterval(descent);
          aloft = false;
          lua.src = defenseMode ? '/img/lua_defensa1.png' : '/img/lua_idle.png';
        }
      }, 20);
    }
  }

  updateCamera();
  detectcollisionItems();
  requestAnimationFrame(moveLua);
}

// -------  attack y defender ------- //
function setDefensa(activa) {
  defenseMode = !!activa;
  if (!aloft && !attacking) {
    lua.src = activa ? '/img/lua_defensa1.png' : '/img/lua_idle.png';
  }
}

function attack(mode) {
  // versión simple: dispara una sequence por toque/tecla
  if (mode === true) {
    if (attacking) return;

    attackSound.cloneNode().play();
    attacking = true;

    const sequence = [
      '/img/lua_ataque1.png',
      '/img/lua_ataque2.png',
      '/img/lua_ataque3.png'
    ];
    let i = 0;

    const animateAttack = setInterval(() => {
      lua.src = sequence[i];
      lua.style.transform = lookingRight ? 'scaleX(1)' : 'scaleX(-1)';
      i++;
      if (i >= sequence.length) {
        clearInterval(animateAttack);
        attacking = false;
        lua.src = defenseMode ? '/img/lua_defensa1.png' : '/img/lua_idle.png';
      }
    }, 250);
  }
  // si quieres ataque continuo al dejar presionado, después lo hacemos bien con interval
}

// ----- Cámara ----- //
const viewportWidth = 600;   // el tamaño visible de la pantalla
const stageWidth = 800;  // el tamaño total del stage

let camaraX = 0;

function updateCamera() {
  let objetivoX = posX - (viewportWidth / 2); // normal
  const margen = 250;
  const limiteIzquierdo = camaraX + margen;
  const limiteDerecho = camaraX + viewportWidth - margen;

  if (posX < limiteIzquierdo) {
    camaraX = Math.max(0, posX - margen);
  } else if (posX > limiteDerecho) {
    camaraX = Math.min(stageWidth - viewportWidth, posX - viewportWidth + margen);
  }
  document.getElementById('stage').style.transform = `translate(${-camaraX}px, 0px)`;
}

// ----- jump ----- //
function jump() {
  if (!aloft) {
    aloft = true;
    lua.src = '/img/lua_pre_jump.png';

    setTimeout(() => {
      lua.src = '/img/lua_jump.png';
    }, 100);

    let alturaMaxima = parseInt(lua.style.top) - 120;
    let subida = setInterval(() => {
      let currentPosition = parseInt(lua.style.top);

      if (currentPosition > alturaMaxima) {
        lua.style.top = `${currentPosition - velocity}px`;
      } else {
        clearInterval(subida);
        lua.src = '/img/lua_post_jump.png';

        let descent = setInterval(() => {
          let currentPosition = parseInt(lua.style.top);
          let newY = detectPlatformCollision();

          if (newY !== null) {
            lua.style.top = `${newY}px`;
            clearInterval(descent);
            aloft = false;
            lua.src = '/img/lua_idle.png';
          } else if (currentPosition < floor) {
            lua.style.top = `${currentPosition + velocity}px`;

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
            lua.style.top = `${floor}px`;
            clearInterval(descent);
            aloft = false;
            lua.src = '/img/lua_idle.png';
          }
        }, 20);
      }
    }, 20);
  }
}

// ------- collisiones platform ------ //
function detectPlatformCollision() {
  const luaTop = parseInt(lua.style.top) || floor;
  const luaBottom = luaTop + lua.offsetHeight;
  const luaCenterX = posX + lua.offsetWidth / 2;

  for (let platform of platforms) {
    const platTop = platform.offsetTop;
    const platLeft = platform.offsetLeft;
    const platRight = platLeft + platform.offsetWidth;

    const collisionHorizontal = luaCenterX >= platLeft && luaCenterX <= platRight;
    const collisionVertical = luaBottom >= platTop && luaBottom <= platTop + 10;

    if (collisionHorizontal && collisionVertical) {
      return platTop - lua.offsetHeight;
    }
  }
  return null;
}






// --------- Items ------- //


let countbirds = 0;
let counthearts = 0;

let soundheart = new Audio("/img/audios/tum_tum_heart.mp3");
let sonidobird = new Audio("/img/audios/sonido_item_general.mp3");

function detectcollisionItems() {
  const luaRect = lua.getBoundingClientRect();

  items.forEach((item) => {
    if (item.style.display === 'none') return;

    const itemRect = item.getBoundingClientRect();

    const collision = !(luaRect.right < itemRect.left ||
                       luaRect.left > itemRect.right ||
                       luaRect.bottom < itemRect.top ||
                       luaRect.top > itemRect.bottom);

    if (collision) {
      item.style.display = 'none';

      if (item.dataset.tipo === 'bird') {
        countbirds++;
        document.getElementById('BirdCounter').textContent = ` x ${countbirds}`;
        sonidobird.cloneNode().play();
      } else if (item.dataset.tipo === 'heart') {
        counthearts++;
        document.getElementById('HeartCounter').textContent = ` x ${counthearts}`;
        soundheart.cloneNode().play();
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
  if (!aloft) lua.src = '/img/lua_idle.png';
});

// Ataque/Defensa por teclado
document.addEventListener('keydown', (e) => {
  if (!gameStarted) return; // <<< bloqueo
  if (e.key === 'w' || e.key === 'W') setDefensa(true);
  if (e.key === 'a' || e.key === 'A') attack(true);
});
document.addEventListener('keyup', (e) => {
  if (!gameStarted) return; // <<< bloqueo
  if (e.key === 'w' || e.key === 'W') setDefensa(false);
});
document.addEventListener('keydown', (e) => {
  if (!gameStarted) return; // <<< bloqueo
  if (e.key === "ArrowUp") jump();
});

// ------ Touch (con bloqueo) ------ //
const $ = (id) => document.getElementById(id);

$('btnIzquierda').addEventListener('touchstart', (e) => { if (!gameStarted) return; keys['ArrowLeft'] = true; });
$('btnDerecha').addEventListener('touchstart',   (e) => { if (!gameStarted) return; keys['ArrowRight'] = true; });
$('btnSalto').addEventListener('touchstart',     (e) => { if (!gameStarted) return; jump(); });

$('btnSalto_left').addEventListener('touchstart',  (e) => { if (!gameStarted) return; keys['ArrowLeft']=true; jump(); });
$('btnSalto_right').addEventListener('touchstart', (e) => { if (!gameStarted) return; keys['ArrowRight']=true; jump(); });

$('btn_a').addEventListener('touchstart', (e) => { if (!gameStarted) return; attack(true); });
$('btn_a').addEventListener('touchend',   (e) => { if (!gameStarted) return; /* ataque simple: nada al soltar */ });

$('btn_w').addEventListener('touchstart', (e) => { if (!gameStarted) return; setDefensa(true); });
$('btn_w').addEventListener('touchend',   (e) => { if (!gameStarted) return; setDefensa(false); });

$('btnIzquierda').addEventListener('touchend', (e) => { if (!gameStarted) return; keys['ArrowLeft'] = false; });
$('btnDerecha').addEventListener('touchend',   (e) => { if (!gameStarted) return; keys['ArrowRight'] = false; });
$('btnSalto_left').addEventListener('touchend',(e) => { if (!gameStarted) return; keys['ArrowLeft'] = false; });
$('btnSalto_right').addEventListener('touchend',(e)=> { if (!gameStarted) return; keys['ArrowRight'] = false; });

// ------------ SONIDO ----------- //
let musicStarted = false;
window.addEventListener('keydown', (e) => {
  if (!gameStarted) return; // <<< no arranca música antes
  if (!musicStarted && ['ArrowLeft', 'ArrowRight', 'ArrowUp', ' '].includes(e.key)) {
    const music = document.getElementById('bg-music');
    music.play().catch(() => {});
    musicStarted = true;
  }
});

// === Efectos pasos/salto === //
const stepSound = new Audio("/img/audios/paso_lua2.mp3");
const jumpSound = new Audio("/img/audios/salto_lua.mp3");

function playStep() {
  const paso = stepSound.cloneNode();
  paso.play();
}
function playJump() {
  const salto = jumpSound.cloneNode();
  salto.play();
}

document.addEventListener("keydown", (e) => {
  if (!gameStarted) return; // <<< bloqueo
  if (e.key === "ArrowLeft" || e.key === "ArrowRight") playStep();
  if (e.key === "ArrowUp") playJump();


});



// -------- Portal detection ------- //

function portalDetection() {
  const luaRect = lua.getBoundingClientRect();
  const portalRect= portal.getBoundingClientRect();

  const nearbyPortal = !(luaRect.right < portalRect.left ||
    luaRect.left > portalRect.right ||
    luaRect.bottom < portalRect.top ||
    luaRect.top > portalRect.bottom);

    return nearbyPortal;
   
}



// ---- auto-zoom móvil ---- //
function fitGameMobile() {
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  const root = document.getElementById('main-container');
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
// al cargar: bloquear (clase en body) y NO iniciar moveLua()
window.addEventListener('load', () => {
  document.body.classList.add('modal-open'); // CSS bloqueará clicks y gestos al juego
});

// al pulsar OK: desbloquea, oculta modal y arranca el loop
const okBtn = document.getElementById('btnOK');
okBtn?.addEventListener('click', () => {
  document.body.classList.remove('modal-open');
  document.getElementById('modal-start').style.display = 'none';
  gameStarted = true;     // <<< ahora sí aceptamos entradas
  moveLua();             // <<< arrancamos el loop

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






// ----- front-end to back-end ---- // 




function saveDataPlayer() {
  const data= {
    name: playerName,
    avatar: playerAvatar,
    hearts: counthearts,
    birds: countbirds
  };

  fetch("http://localhost:3000/guardar-jugador", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });


}


// ---- Final Screen ----- // 

function showFinalScreen() {
  const message='Bien hecho '
}




