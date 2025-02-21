// Evita el desplazamiento del navegador al presionar teclas
document.addEventListener("keydown", (e) => {
  if (["ArrowUp", "ArrowLeft", "ArrowRight"].includes(e.key)) {
    e.preventDefault();
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
let posY = 725; // Posición inicial en el suelo
const step = 5;
let keys = {}; 
let enElAire = false; 
let velocidad = 10;
const gravedad = 5; 

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

// === Gravedad === //
function aplicarGravedad() {
  if (enElAire) {
    posY += gravedad;
    lua.style.top = `${posY}px`;
  }

  // Si Lua no está sobre una plataforma, la gravedad sigue aplicándose
  if (!detectandoPlataforma()) {
    enElAire = true;
  }

  requestAnimationFrame(aplicarGravedad);
}

aplicarGravedad();

// === Detección de colisión con plataformas === //
const plataformas = document.querySelectorAll(".plataforma");

function detectandoPlataforma() {
  for (let plataforma of plataformas) {
      let platTop = plataforma.offsetTop;
      let platBottom = platTop + plataforma.offsetHeight;
      let platLeft = plataforma.offsetLeft;
      let platRight = platLeft + plataforma.offsetWidth;

      let luaBottom = lua.offsetTop + lua.offsetHeight;
      let luaCenterX = lua.offsetLeft + (lua.offsetWidth / 2);

      if (luaBottom >= platTop && luaBottom <= platBottom &&
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
          if (!detectandoPlataforma()) {
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
