/* -------- HARU --------- */ 

// Referencias al gato Haru y al sonido
const haru = document.getElementById("haru");
const haruSound = document.getElementById("haruSound"); // <-- ojo: H en minúscula

// Imágenes para caminar y sentarse
const haruWalkFrames = ["img/haru/haru_step1.png", "img/haru/haru_step2.png"];
const haruSitFrames = ["img/haru/haru_sit1.png", "img/haru/haru_sit2.png", "img/haru/haru_sit3.png"];

//globo

const haruSpeech = document.getElementById("haru-speech");


// Variables de estado
let haruFrameIndex = 0;
let haruPosX = 0;
let haruDirection = 1;
let haruWalking = true;
let haruSitting = false;

// Animación general
function updateHaruFrame() {
  if (haruSitting) {
    haru.src = haruSitFrames[haruFrameIndex % haruSitFrames.length];
  } else if (haruWalking) {
    haru.src = haruWalkFrames[haruFrameIndex % haruWalkFrames.length];
    haruPosX += 6 * haruDirection;
    if (haruPosX > window.innerWidth - 100 || haruPosX < 0) {
      haruDirection *= -1;
      haru.style.transform = `scaleX(${haruDirection})`;
    }
    haru.style.left = haruPosX + "px";
  }
  haruFrameIndex++;
}

let haruInterval = setInterval(updateHaruFrame, 200);

// Teclado
window.addEventListener("keydown", (e) => {
  // Flecha derecha
  if (e.key === "ArrowRight") {
    haruDirection = 1;
    haru.style.transform = "scaleX(1)";
    haruPosX += 10;
    haruWalking = true;
    haruSitting = false;
    haruSound.pause();
    haruSound.currentTime = 0;
  }

  // Flecha izquierda
  if (e.key === "ArrowLeft") {
    haruDirection = -1;
    haru.style.transform = "scaleX(-1)";
    haruPosX -= 10;
    haruWalking = true;
    haruSitting = false;
    haruSound.pause();
    haruSound.currentTime = 0;
  }

  // Enter → Haru se sienta y llora
  if (e.key === "Enter") {
    haruWalking = false;
    haruFrameIndex = 0;
  
    // Alternar entre sentado y de pie
    if (!haruSitting) {
      haruSitting = true;
      haruSound.loop = true;
      haruSound.currentTime = 0;
      haruSound.play();
      haruSpeech.style.display = "block";
    } else {
      haruSitting = false;
      haruWalking= true;
      haruSound.pause();
      haruSound.currentTime = 0;
      haruSpeech.style.display = "none";
    }
  }

});
  

// Detener caminata al soltar teclas
window.addEventListener("keyup", (e) => {
  if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
    haruWalking = false;
    haruFrameIndex = 0;
  }
});

// Pantalla táctil → alterna entre llorar o levantarse

window.addEventListener("touchstart", () => {
    haruSitting = !haruSitting;
    haruWalking = false;
    haruFrameIndex = 0;
  
    if (haruSitting) {
      haruSound.loop = true;
      haruSound.currentTime = 0;
      haruSound.play();
      haruSpeech.style.display = "block"; // 👈 Esta línea faltaba
    } else {
      haruSound.pause();
      haruSound.currentTime = 0;
      haruSpeech.style.display = "none";
      haruWalking = true;
    }

    // vibracion

    if ("vibrate" in navigator) {
        navigator.vibrate(100);
      }
      

  });
  