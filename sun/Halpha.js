const canvas = document.getElementById('sunCanvas');
const ctx = canvas.getContext('2d');

// Carga del PNG personalizado de Procreate
const img = new Image();
img.src = 'sun2.png'; // Asegúrate de que esté en la carpeta 'sun/' y bien escrito

img.onload = () => {
  // Dibuja la imagen al tamaño del canvas
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
};

// Puedes cambiar el tamaño del canvas si quieres una imagen más grande
// canvas.width = 400;
// canvas.height = 400;

let clickMarker = null;

canvas.addEventListener('click', function(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
  
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
  
    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
  
    const radius = canvas.width / 2;
  
    if (distance > radius) {
      // Click fuera del Sol
      return;
    }
  
    // Relación de la distancia al radio (0 en el centro, 1 en el borde)
    const r_ratio = dx / radius; // solo componente horizontal → rotación
  
    // Parámetros físicos
    const v_rot = 2.005; // km/s en el ecuador
    const cos_theta = Math.cos(7.25 * Math.PI / 180); // inclinación del Sol
  
    const v_proj = v_rot * r_ratio * cos_theta;
    const lambda0 = 656.3; // nm
    const c = 3e5; // km/s
  
    const delta_lambda = lambda0 * (v_proj / c);
    const lambda_obs = lambda0 + delta_lambda;
  
    // Mostrar resultados en pantalla
    document.getElementById('velocity').textContent = v_proj.toFixed(3);
    document.getElementById('wavelength').textContent = lambda_obs.toFixed(3);


    // 🔴 ACTUALIZA EL GRÁFICO CON EL DESPLAZAMIENTO
    createSpectrum(lambda_obs);




  
    // Aquí más adelante actualizaremos el gráfico del espectro con el corrimiento

     // Guardar la posición para dibujar el marcador
    clickMarker = { x, y };

    setTimeout(() => {
        clickMarker = null;
        drawSun();
    }, 1000); // se borra después de 1 segundo

    drawSun(); // redibuja el Sol con el marcador



  });


  function drawSun() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  
    if (clickMarker) {
      ctx.beginPath();
      ctx.arc(clickMarker.x, clickMarker.y, 8, 0, 2 * Math.PI);
      ctx.strokeStyle = 'cyan';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }
  

  canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
  
    const dx = x - canvas.width / 2;
    const dy = y - canvas.height / 2;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const radius = canvas.width / 2;
  
    drawSun();
  
    if (distance <= radius) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  });
  


  //  grafico 


  let chart;

function createSpectrum(lambda_shift = 656.3) {
  const longitudes = [];
  const intensidades = [];

  for (let i = 655; i <= 657; i += 0.001) {
    const intensidad = 1 - Math.exp(-Math.pow((i - lambda_shift) * 100, 2)); // simula línea de absorción
    longitudes.push(i.toFixed(4));
    intensidades.push(intensidad);
  }

  if (chart) {
    chart.data.labels = longitudes;
    chart.data.datasets[0].data = intensidades;
    chart.update();
    return;
  }

  const ctx = document.getElementById('spectrumChart').getContext('2d');
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: longitudes,
      datasets: [{
        label: 'Simulated Hα Line',
        data: intensidades,
        borderColor: 'red',
        borderWidth: 2,
        pointRadius: 0,
        fill: false
      }]
    },
    options: {
      scales: {
        x: {
          min:656.28,
          max:656.32,
          ticks : {stepSize: 0.005},  
          title: {
            display: true,
            text: 'Wavelength (nm)'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Normalized Intensity'
          },
          min: 0,
          max: 1
        }
      }
    }
  });
}

createSpectrum();
  