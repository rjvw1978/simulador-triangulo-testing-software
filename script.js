// Referencias del DOM
const canvas = document.getElementById('triangleCanvas');
const ctx = canvas.getContext('2d');

const inputs = {
  coverage: document.getElementById('coverage'),
  time: document.getElementById('time'),
  cost: document.getElementById('cost')
};

const labels = {
  coverage: document.getElementById('coverageVal'),
  time: document.getElementById('timeVal'),
  cost: document.getElementById('costVal')
};

const diagnosisText = document.getElementById('diagnosisText');

// Nodos base del triángulo (posiciones fijas)
const topNode = { x: 225, y: 70, name: "Cobertura" };
const leftNode = { x: 70, y: 330, name: "Tiempo" };
const rightNode = { x: 380, y: 330, name: "Recursos/Costo" };

function updateUI() {
  const cov = parseInt(inputs.coverage.value);
  const time = parseInt(inputs.time.value);
  const cost = parseInt(inputs.cost.value);

  // Actualizar textos
  labels.coverage.textContent = `${cov}%`;
  labels.time.textContent = `${time}%`;
  labels.cost.textContent = `${cost}%`;

  drawTriangle(cov, time, cost);
  updateDiagnosis(cov, time, cost);
}

function drawTriangle(cov, time, cost) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 1. Dibujar el triángulo base (referencia en gris claro)
  ctx.beginPath();
  ctx.moveTo(topNode.x, topNode.y);
  ctx.lineTo(leftNode.x, leftNode.y);
  ctx.lineTo(rightNode.x, rightNode.y);
  ctx.closePath();
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
  ctx.stroke();
  ctx.setLineDash([]); // Reset dash

  // 2. Calcular los puntos dinámicos basados en los valores
  const centerX = 225;
  const centerY = 240;

  const pTop = {
    x: centerX + (topNode.x - centerX) * (cov / 100),
    y: centerY + (topNode.y - centerY) * (cov / 100)
  };

  const pLeft = {
    x: centerX + (leftNode.x - centerX) * ((110 - time) / 100),
    y: centerY + (leftNode.y - centerY) * ((110 - time) / 100)
  };

  const pRight = {
    x: centerX + (rightNode.x - centerX) * (cost / 100),
    y: centerY + (rightNode.y - centerY) * (cost / 100)
  };

  // 3. Relleno del triángulo activo con gradiente celeste
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, 'rgba(56, 189, 248, 0.6)');
  gradient.addColorStop(1, 'rgba(2, 132, 199, 0.4)');

  ctx.beginPath();
  ctx.moveTo(pTop.x, pTop.y);
  ctx.lineTo(pLeft.x, pLeft.y);
  ctx.lineTo(pRight.x, pRight.y);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 3;
  ctx.stroke();

  // 4. Dibujar vértices y etiquetas
  drawNode(topNode.x, topNode.y, "Cobertura (Alcance)", cov + "%", '#0284c7');
  drawNode(leftNode.x, leftNode.y, "Tiempo Limitado", time + "%", '#0284c7');
  drawNode(rightNode.x, rightNode.y, "Costo / Recursos", cost + "%", '#0284c7');
}

function drawNode(x, y, label, val, color) {
  ctx.beginPath();
  ctx.arc(x, y, 7, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#fff';
  ctx.stroke();

  ctx.fillStyle = '#1e293b';
  ctx.font = 'bold 12px Segoe UI';
  ctx.textAlign = 'center';
  ctx.fillText(label, x, y < 200 ? y - 15 : y + 25);
}

function updateDiagnosis(cov, time, cost) {
  let diag = "";

  if (cov > 75 && time < 40 && cost < 50) {
    diag = "⚠️ **Riesgo Alto:** Intentar alta cobertura en poco tiempo y con bajo presupuesto generará agotamiento del equipo (burnout) o fallas críticas en producción.";
  } else if (cov > 70 && time < 50 && cost >= 70) {
    diag = "⚡ **Estrategia Agresiva:** Para mantener alta cobertura en poco tiempo, estás invirtiendo en más recursos (automatización o personal).";
  } else if (cov <= 40 && time >= 60) {
    diag = "🐢 **Poco Eficiente:** Tienes buen tiempo disponible pero la cobertura es muy baja. Considera añadir más tipos de prueba.";
  } else if (cost < 35 && cov > 50) {
    diag = "📉 **Presupuesto Ajustado:** Cobertura moderada/alta con poco presupuesto. Requiere maximizar la automatización open-source.";
  } else {
    diag = "⚖️ **Estrategia Balanceada:** Existe un equilibrio manejable entre los plazos, la inversión de presupuesto y las pruebas a ejecutar.";
  }

  diagnosisText.innerHTML = diag.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}

function setPreset(type) {
  if (type === 'balanced') {
    inputs.coverage.value = 60;
    inputs.time.value = 60;
    inputs.cost.value = 60;
  } else if (type === 'fast') {
    inputs.coverage.value = 40;
    inputs.time.value = 25;
    inputs.cost.value = 50;
  } else if (type === 'quality') {
    inputs.coverage.value = 90;
    inputs.time.value = 70;
    inputs.cost.value = 85;
  } else if (type === 'lowcost') {
    inputs.coverage.value = 50;
    inputs.time.value = 50;
    inputs.cost.value = 25;
  }
  updateUI();
}

// Event Listeners
Object.values(inputs).forEach(input => {
  input.addEventListener('input', updateUI);
});

// Inicializar al cargar
updateUI();
