

/*

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


*/

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
  if (!enElAire) lua.src = 'img/lua_idle.png';
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
    lua.src = 'img/lua_pre_jump.png';

    setTimeout(() => {
      lua.src = 'img/lua_jump.png';
    }, 100);

    let alturaMaxima = suelo - 120; /* la altura del salto esta con respecto al suelo, no una superficie */ 

    let subida = setInterval(() => {   /* setINTERVAL es como un while, pero lo repite cada 20ms */
      let posicionActual = parseInt(lua.style.top) || suelo;

      if (posicionActual > alturaMaxima) {
        lua.style.top = `${posicionActual - velocidad}px`;
      } else {
        clearInterval(subida);
        lua.src = 'img/lua_post_jump.png';

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

moverLua();
aplicarGravedad();


/* --------- usuario ------- */


function verificarUsuario() {
  let usuario = document.getElementById('username').value.trim().toLowerCase();

  let usuariosPermitidos = ["astrocony", "guardian_poto"]; // Agrega más usuarios aquí

  if (usuariosPermitidos.includes(usuario)) {
      window.location.href = "juego.html"; // Redirige al juego
  } else {
      alert("Usuario incorrecto, intenta de nuevo");
  }
}


/*
// ------- MAIN PAGE ------------

document.addEventListener("DOMContentLoaded", function () {
  let banners = document.querySelectorAll(".carousel a");
  let index = 0;

  // Verificar si hay banners antes de continuar
  if (banners.length === 0) {
      console.error("❌ No se encontraron banners en el carrusel.");
      return; // Salir del script si no hay banners
  }

  // Asegurar que el primer banner es visible al inicio
  banners.forEach((b, i) => {
      b.style.opacity = (i === 0) ? "1" : "0"; // Solo el primero visible
      b.style.zIndex = (i === 0) ? "2" : "1"; // Asegurar orden de capas
      b.style.position = "absolute";
      b.style.transition = "opacity 1s ease-in-out";
  });

  function cambiarBanner() {
      banners[index].style.opacity = "0"; // Ocultar actual
      banners[index].style.zIndex = "1";  // Enviar al fondo

      index = (index + 1) % banners.length; // Pasar al siguiente

      banners[index].style.opacity = "1"; // Mostrar nuevo
      banners[index].style.zIndex = "2";  // Traerlo al frente
  }

  // Esperar 1 segundo antes de iniciar para evitar bugs
  setTimeout(() => {
      setInterval(cambiarBanner, 3000); // Cambia cada 3 segundos
  }, 1000);
}); 

*/