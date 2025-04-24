/* -------- HARU --------- */ 

const haru = document.getElementById("haru");

const haruWalkFrames = ["img/haru/haru_step1.png", "img/haru/haru_step2.png"];
const haruSitFrames = ["img/haru/haru_sit1.png", "img/haru/haru_sit2.png", "img/haru/haru_sit3.png"];
let haruFrameIndex = 0;
let haruPosX = 0;
let haruDirection = 1; // 1: derecha, -1: izquierda
let haruWalking = true;

function updateHaruFrame() {
  if (haruWalking) {
    haru.src = haruWalkFrames[haruFrameIndex % haruWalkFrames.length];
    haruFrameIndex++;
    haruPosX += 18
     * haruDirection;
    if (haruPosX > window.innerWidth - 100 || haruPosX < 0) {
      haruDirection *= -1;
      haru.style.transform = `scaleX(${haruDirection})`;
    }
    haru.style.left = haruPosX + "px";
  } else {
    haru.src = haruSitFrames[haruFrameIndex % haruSitFrames.length];
    haruFrameIndex++;
  }
}

let haruInterval = setInterval(updateHaruFrame, 200);

function toggleHaruSit() {
  haruWalking = !haruWalking;
  haruFrameIndex = 0;
}

// Para PC
window.addEventListener("keydown", (e) => {
  if (e.key === "Enter") toggleHaruSit();
});

// Para móviles
window.addEventListener("touchstart", () => {
  toggleHaruSit();
});

// Ajustar posición si la ventana cambia de tamaño
window.addEventListener("resize", () => {
  if (haruPosX > window.innerWidth - 100) {
    haruPosX = window.innerWidth - 100;
  }
});
