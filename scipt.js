function cambiarMensaje() {
    const mensajes = [
      "🌙 Bienvenido, Guardián de Lua.",
      "✨ Tu misión es proteger el conocimiento del universo.",
      "⭐ Lua cree en ti, sigue tu intuición.",
      "💫 El viaje apenas comienza, prepárate para la aventura."
    ];
  
    const mensajeElemento = document.getElementById("mensaje");
    const indice = Math.floor(Math.random() * mensajes.length);
    mensajeElemento.textContent = mensajes[indice];
  }
  