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


  