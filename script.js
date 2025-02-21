// === Evita el desplazamiento del navegador cuando usas las teclas de flecha === //
document.addEventListener("keydown", (e) => {
  if (["ArrowUp", "ArrowLeft", "ArrowRight"].includes(e.key)) {
    e.preventDefault(); // Previene el desplazamiento de la página al presionar estas teclas
  }
});

// === 🔥 VARIABLES PRINCIPALES === //
const lua = document.getElementById('luaSprite'); // Obtiene el elemento Lua
let posX = 100; // Posición horizontal inicial
let posY = 690; // Posición vertical inicial
const step = 5; // Cantidad de píxeles que Lua se mueve lateralmente
let keys = {}; // Almacena las teclas presionadas
let enElAire = false; // Estado de si Lua está en el aire
let dobleSaltoDisponible = true; // Permite un segundo salto en el aire
let velocidadSalto = 10; // Velocidad del salto
const gravedad = 5; // Intensidad de la gravedad
const suelo = 725; // Coordenada del suelo

// === 🚀 EVENTOS PARA DETECTAR CUÁNDO SE PRESIONAN Y SUELTAN TECLAS === //
document.addEventListener('keydown', (e) => {
  keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
  keys[e.key] = false;
  if (!enElAire) lua.src = 'img/lua_idle.png';
});

// === 🔄 MOVIMIENTO LATERAL === //
function moverLua() {
  let moviendo = false;

  if (keys['ArrowRight'] && posX < 730) { // Movimiento hacia la derecha
    posX += step;
    lua.style.left = `${posX}px`;
    lua.src = 'img/lua_step.png';
    lua.style.transform = 'scaleX(1)';
    moviendo = true;
  }

  if (keys['ArrowLeft'] && posX > 0) { // Movimiento hacia la izquierda
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

// === 🛑 GRAVEDAD === //
function aplicarGravedad() {
  let plataformaDetectada = detectarColisionPlataforma();
  
  if (!plataformaDetectada && posY < suelo) {
    enElAire = true;
    posY += gravedad;
    lua.style.top = `${posY}px`;
  } else if (plataformaDetectada !== null) {
    enElAire = false;
    dobleSaltoDisponible = true; // Restablece el doble salto al aterrizar
    posY = plataformaDetectada - lua.offsetHeight;
    lua.style.top = `${posY}px`;
  }

  requestAnimationFrame(aplicarGravedad);
}

aplicarGravedad();

// === 🔍 DETECCIÓN DE COLISIÓN CON PLATAFORMAS === //
const plataformas = document.querySelectorAll(".plataforma");

function detectarColisionPlataforma() {
  for (let plataforma of plataformas) {
    let platTop = plataforma.offsetTop;
    let platLeft = plataforma.offsetLeft;
    let platRight = platLeft + plataforma.offsetWidth;

    let luaBottom = posY + lua.offsetHeight;
    let luaCenterX = posX + (lua.offsetWidth / 2);

    if (luaBottom >= platTop && luaBottom <= platTop + 5 && 
        luaCenterX >= platLeft && luaCenterX <= platRight) {
        return platTop;
    }
  }
  return null;
}

// === 🔼 SALTO CON DOBLE SALTO === //
function saltar() {
  if (!enElAire || dobleSaltoDisponible) {
    if (enElAire) {
      dobleSaltoDisponible = false; // Si ya está en el aire, usa el doble salto
    }
    enElAire = true;
    lua.src = 'img/lua_jump.png';
    let alturaMaxima = posY - 120;

    let subida = setInterval(() => {
      if (posY > alturaMaxima) {
        posY -= velocidadSalto;
        lua.style.top = `${posY}px`;
      } else {
        clearInterval(subida);
        let bajada = setInterval(() => {
          let plataformaDetectada = detectarColisionPlataforma();

          if (plataformaDetectada !== null) {
            posY = plataformaDetectada - lua.offsetHeight;
            lua.style.top = `${posY}px`;
            enElAire = false;
            dobleSaltoDisponible = true; // Restablece el doble salto al aterrizar
            clearInterval(bajada);
            lua.src = 'img/lua_idle.png';
          } else if (posY < suelo) {
            posY += velocidadSalto;
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

document.getElementById('btnIzquierda').addEventListener('touchstart', () => keys['ArrowLeft'] = true);
document.getElementById('btnDerecha').addEventListener('touchstart', () => keys['ArrowRight'] = true);
document.getElementById('btnSalto').addEventListener('touchstart', () => saltar());

document.getElementById('btnIzquierda').addEventListener('touchend', () => keys['ArrowLeft'] = false);
document.getElementById('btnDerecha').addEventListener('touchend', () => keys['ArrowRight'] = false);

document.addEventListener('keydown', (e) => {
  if (e.key === "ArrowUp") saltar();
});
