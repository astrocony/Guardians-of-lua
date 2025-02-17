// Array de mensajes posibles 

const mensajes = [ 
    "¿Estás perdido? Pronto encontraras la Luz",
    "Una estrella hay al final del tunel esperandote",
    "Sigue creyendo, estás muy cerca",
    "Necesitas descansar un poco y todo te encontrará",
    "¡Una estrella te encontrará! "
];

// indice para recorrer los mensajes

let indiceMensaje=0;

function cambiarMensaje(){
  const mensajeElemento = document.getElementById('mensaje');
  mensajeElemento.innerText = mensajes[indiceMensaje];
  mensajeElemento.style.color = "#7b1fa2";
  mensajeElemento.style.fontSize = "22px";

  // Avanza al siguiente mensaje, vuelve al primero al terminar
  indiceMensaje = (indiceMensaje + 1) % mensajes.length;

}



const lua = document.getElementById('lua');
let posicionX = window.innerWidth / 2 - 60; // Posición inicial centrada
const velocidad = 10;

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') {
    // Mueve a Lua a la derecha
    posicionX += velocidad;
    lua.src = 'img/lua_step.png';
    lua.style.transform = 'scaleX(1)'; // Mirando derecha
  } else if (e.key === 'ArrowLeft') {
    // Mueve a Lua a la izquierda
    posicionX -= velocidad;
    lua.src = 'img/lua_step.png';
    lua.style.transform = 'scaleX(-1)'; // Mirando izquierda
  }

  // Aplica el movimiento
  lua.style.left = `${posicionX}px`;

  // Vuelve al estado "quieto" después de un momento
  setTimeout(() => {
    lua.src = 'img/lua_idle.png';
  }, 150);
});

  