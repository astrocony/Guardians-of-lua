 // === Movimiento de Lua === //
const lua = document.getElementById('luaSprite');
const items = document.querySelectorAll(".item");
let posX = 100;
const step = 5;
let keys = {}; 
let aloft = false; 
let velocity = 10;
const floor = 690;
lua.style.top = `${floor}px`;
lua.style.left = `${posX}px`; // asegura la posición inicial

const platforms = document.querySelectorAll(".platform");

let defenseMode = false;
let lookingRight = true;  // para saber a qué lado mira Lua
let attacking = false;


const attackSound = new Audio("/img/audios/espada_lua.mp3");





/* MOVER A LUA */


function moveLua() {
  let moving = false;

  if (keys['ArrowRight'] && posX < 1980) {
    if (defenseMode || attacking) {
      // retrocede
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

  // ✅ ESTAS DOS LÍNEAS VAN AQUÍ, AL FINAL

  updateCamera();
  requestAnimationFrame(moveLua);
  detectcollisionItems();
}


/* -------  funcion attack y defender -------*/

function setDefensa(activa) {
  defenseMode = !!activa;
  if (!aloft && !attacking) {
    lua.src = activa ? '/img/lua_defensa1.png' : '/img/lua_idle.png';
  }
}

function attack(mode) {
  if (mode== true) {
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
  } else if (mode== false){
    clearInterval(ataqueInterval);
    ataqueInterval= null;
  }

}





/* ----- Seguir a lua con la camara ----- */

const viewportWidth = 600;   // el tamaño visible de la pantalla
const stageWidth = 2000;  // el tamaño total del stage


let camaraX = 0;
let camaraY = 0;

function updateCamera() {
  let objetivoX = posX - (viewportWidth / 2); // normal

  // Definir los márgenes de la "zona muerta"
  const margen = 250;
  const limiteIzquierdo = camaraX + margen;
  const limiteDerecho = camaraX + viewportWidth - margen;

  if (posX < limiteIzquierdo) {
    camaraX = Math.max(0, posX - margen);
  } else if (posX > limiteDerecho) {
    camaraX = Math.min(stageWidth - viewportWidth, posX - viewportWidth + margen);
  }
  
  // Aplicar transform solo en X
  document.getElementById('stage').style.transform = `translate(${-camaraX}px, 0px)`;
}









/* ----- jump ---- */ 

function jump() {
  if (!aloft) {  // Solo puede jump si no está en el aire
    aloft = true;
    lua.src = '/img/lua_pre_jump.png';

    setTimeout(() => {
      lua.src = '/img/lua_jump.png';
    }, 100);

    let alturaMaxima = parseInt(lua.style.top) - 120;  // Salto relativo a la posición actual
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




/* ------- Colisioones ------ */



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






/* --------- contador y detector de objetos ------- */

let countbirds = 0;
let counthearts = 0;

let soundheart = new Audio("/img/audios/tum_tum_heart.mp3");
let sonidobird = new Audio("/img/audios/sonido_item_general.mp3");

function detectcollisionItems() {
  const luaRect = lua.getBoundingClientRect();

  items.forEach((item) => {
    if (item.style.display === 'none') return;  // ✅ Ya desaparecido, no revisa

    const itemRect = item.getBoundingClientRect();

    const collision = !(luaRect.right < itemRect.left ||
                       luaRect.left > itemRect.right ||
                       luaRect.bottom < itemRect.top ||
                       luaRect.top > itemRect.bottom);

    if (collision) {
      item.style.display = 'none'; // ✅ Desaparece al collisionar

      if (item.dataset.tipo === 'bird') {
        countbirds++;
        document.getElementById('BirdCounter').textContent = ` x ${countbirds}`;
        sonidobird.cloneNode().play();  // 🔊 Reproducir sonido del pájaro
      } else if (item.dataset.tipo === 'heart') {
        counthearts++;
        document.getElementById('HeartCounter').textContent = ` x ${counthearts}`;
        soundheart.cloneNode().play();  // 🔊 Reproducir sonido del corazón
      }
    }
  });
}



/* ------ teclado ------*/

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
  if (!aloft) lua.src = '/img/lua_idle.png';
});


document.addEventListener('keydown', (e) => {
  if (e.key === 'w' || e.key === 'W') setDefensa(true);
  if (e.key === 'a' || e.key === 'A') attack(true);
});

document.addEventListener('keyup', (e) => {
  if (e.key === 'w' || e.key === 'W') setDefensa(false);
});





/* -------touch botones (creo)------ */



document.getElementById('btnIzquierda').addEventListener('touchstart', () => keys['ArrowLeft'] = true);
document.getElementById('btnDerecha').addEventListener('touchstart', () => keys['ArrowRight'] = true);
document.getElementById('btnSalto').addEventListener('touchstart', () => jump());

document.getElementById('btnSalto_left').addEventListener('touchstart',() => {keys['ArrowLeft']=true; jump();} );
document.getElementById('btnSalto_right').addEventListener('touchstart',()=>{keys['ArrowRight']=true;jump();});

document.getElementById('btn_a').addEventListener('touchstart',() => attack(true)); 
document.getElementById('btn_a').addEventListener('touchend', () => attack(false));

document.getElementById('btn_w').addEventListener('touchstart', () => setDefensa(true));
document.getElementById('btn_w').addEventListener('touchend', () => setDefensa(false));

document.getElementById('btnIzquierda').addEventListener('touchend', () => keys['ArrowLeft'] = false);
document.getElementById('btnDerecha').addEventListener('touchend', () => keys['ArrowRight'] = false);

document.getElementById('btnSalto_left').addEventListener('touchend', () => keys['ArrowLeft'] = false);
document.getElementById('btnSalto_right').addEventListener('touchend', () => keys['ArrowRight'] = false);

document.addEventListener('keydown', (e) => {
  if (e.key === "ArrowUp") jump();
});

moveLua();
/*aplicarGravedad(); */


/* ------------ SONIDO ----------- */


/* --- background -----*/

let musicStarted = false;

window.addEventListener('keydown', (e) => {
  if (!musicStarted && ['ArrowLeft', 'ArrowRight', 'ArrowUp', ' '].includes(e.key)) {
    const music = document.getElementById('bg-music');
    music.play().then(() => {
      console.log("🎵 Música iniciada con una tecla");
    }).catch((err) => {
      console.warn("🚫 Bloqueo de sonido:", err);
    });
    musicStarted = true;
  }
});

/* ---- salto y caminata ---- */

// === SONIDOS DE LUA === //
const stepSound = new Audio("/img/audios/paso_lua2.mp3");
const jumpSound = new Audio("/img/audios/salto_lua.mp3");

function playStep() {
  // Clonamos el audio para que pueda sonar aunque el anterior no haya terminado
  const paso = stepSound.cloneNode();
  paso.play();
}

function playJump() {
  const salto = jumpSound.cloneNode();
  salto.play();
}

// Escuchar teclas
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
    playStep();
  }
  if (e.key === "ArrowUp") {
    playJump();
  }
});


/* ---- hacer zoom pantalla automatico en celular ---- */


function fitGameMobile() {
  // ¿estamos en pantalla chica?
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  const root = document.getElementById('main-container');
  if (!root) return;

  // tamaño base de TU juego (tu marco es 1000x1000)
  const BASE = 1000;

  // reserva opcional para botones (ajústalo o pon 0 si no quieres reservar)
  const CONTROLS_H = 140;

  // espacio disponible en pantalla (CSS px)
  const availW = window.innerWidth;
  const availH = Math.max(0, window.innerHeight - CONTROLS_H);

  // factor de escala (mantiene proporción)
  //const s = isMobile ? Math.min(availW / BASE, availH / BASE) : 1;
  const s = isMobile ? 0.62 : 1;

  root.style.transform = `scale(${s})`;
  root.style.transformOrigin = 'top left';
}

// correr al cargar y cuando cambie tamaño/orientación
window.addEventListener('load', fitGameMobile);
window.addEventListener('resize', fitGameMobile);
window.addEventListener('orientationchange', fitGameMobile);



// --------- block game initial ------- //

// Al cargar: bloquea el juego y deja visible la modal
window.addEventListener('load', () => {
  document.body.classList.add('modal-open');
});

// Al pulsar OK: desbloquea y oculta la modal
const okBtn = document.getElementById('btnOK');
okBtn?.addEventListener('click', () => {
  document.body.classList.remove('modal-open');               // desbloquea
  document.getElementById('modal-start').style.display = 'none'; // oculta la modal
});







