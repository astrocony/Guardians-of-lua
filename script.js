document.addEventListener("keydown", (e) => {
  if (["ArrowUp", "ArrowLeft", "ArrowRight"].includes(e.key)) {
    e.preventDefault(); // Evita el desplazamiento de la página
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
const step = 5;
let keys = {}; 
let enElAire = false; 
let velocidad = 10; // 🔹 Agregado fuera de la función para modificarlo más fácilmente

document.addEventListener('keydown', (e) => {
  keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
  keys[e.key] = false;
  if (!enElAire) lua.src = 'img/lua_idle.png';
});




const plataformas = document.querySelectorAll(".plataforma"); // 🔹 Obtiene todas las plataformas

function detectarColisionPlataforma() {
  for (let plataforma of plataformas) {
    let platTop = plataforma.offsetTop;
    let platLeft = plataforma.offsetLeft;
    let platRight = platLeft + plataforma.offsetWidth;

    let luaBottom = parseInt(lua.style.top) + lua.offsetHeight;
    let luaCenterX = parseInt(lua.style.left) + (lua.offsetWidth / 2);

    if (luaBottom >= platTop && luaBottom <= platTop + 5 &&
        luaCenterX >= platLeft && luaCenterX <= platRight) {
      return platTop; // 🔹 Devuelve la altura de la plataforma
    }
  }
  return null; // 🔹 Devuelve `null` si no hay plataforma debajo
}

function aplicarGravedad() {
  let plataformaDetectada = detectarColisionPlataforma();

  if (plataformaDetectada !== null) {
    posY = plataformaDetectada - lua.offsetHeight; // 🔹 Lua aterriza sobre la plataforma
    lua.style.top = `${posY}px`;
    enElAire = false; // 🔹 Ya no está en el aire
  } else if (posY < suelo) {
    posY += 5; // 🔹 Hace que Lua caiga con gravedad
    lua.style.top = `${posY}px`;
  } else {
    enElAire = false; // 🔹 Si llega al suelo, se detiene ahí
  }

  requestAnimationFrame(aplicarGravedad); // 🔹 Se repite para mantener la gravedad funcionando
}

aplicarGravedad();


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

  //limitar bordes del escenario

  if (posX < 0) posX = 0;
  if (posX > 730) posx = 730; // ajusta el valor segun el escenario

  if (!moviendo && !enElAire) {
    lua.src = 'img/lua_idle.png';
  }

  requestAnimationFrame(moverLua);
}

moverLua(); 


// === Asegurar que Lua empieza en la posición correcta === //


const suelo = 720; // Posición fija del suelo
lua.style.top = `${suelo}px`; // Define la posición inicial en el suelo

/*  ----ANTIGUA------
function saltar() {
  if (!enElAire) {
    enElAire = true;
    lua.src = 'img/lua_pre_jump.png';

    setTimeout(() => {
      lua.src = 'img/lua_jump.png';
    }, 100);

    let alturaMaxima = suelo - 120; // 🔹 Aumenté la altura del salto a -120 (antes era -80)

    let subida = setInterval(() => {
      let posicionActual = parseInt(lua.style.top) || suelo;

      if (posicionActual > alturaMaxima) {
        lua.style.top = `${posicionActual - velocidad}px`; // 🔹 Ahora usa la variable velocidad
      } else {
        clearInterval(subida);
        lua.src = 'img/lua_post_jump.png';

        let bajada = setInterval(() => {
          let posicionActual = parseInt(lua.style.top) || suelo;
          
          if (posicionActual < suelo) {
            lua.style.top = `${posicionActual + velocidad}px`; // 🔹 Ahora usa la variable velocidad

            // Permitir movimiento mientras baja
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
            lua.src = 'img/lua_idle.png';
          }
        }, 20);
      }
    }, 20);
  }
}


*/

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







// === Controles táctiles === //
document.getElementById('btnIzquierda').addEventListener('touchstart', () => keys['ArrowLeft'] = true);
document.getElementById('btnDerecha').addEventListener('touchstart', () => keys['ArrowRight'] = true);
document.getElementById('btnSalto').addEventListener('touchstart', () => saltar());

document.getElementById('btnIzquierda').addEventListener('touchend', () => keys['ArrowLeft'] = false);
document.getElementById('btnDerecha').addEventListener('touchend', () => keys['ArrowRight'] = false);

document.addEventListener('keydown', (e) => {
  if (e.key === "ArrowUp") saltar();
});

