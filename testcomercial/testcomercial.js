
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
  
  
  
  
  
  
  