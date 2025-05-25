const canvas = document.getElementById('paint-canvas');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

let drawing = false;
let currentTool = 'marker';
let markerSize = 1;
let eraserSize = 1;
let color = '#000000';

canvas.addEventListener('mousedown', (e) => { drawing = true; draw(e); });
canvas.addEventListener('mouseup', () => drawing = false);
canvas.addEventListener('mouseout', () => drawing = false);
canvas.addEventListener('mousemove', draw);

function draw(e) {
  if (!drawing) return;
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) * canvas.width / rect.width);
  const y = Math.floor((e.clientY - rect.top) * canvas.height / rect.height);
  const size = currentTool === 'marker' ? markerSize : eraserSize;
  ctx.fillStyle = currentTool === 'marker' ? color : '#FFFFFF';
  ctx.fillRect(x, y, size, size);
}

// UI Interactions
document.querySelectorAll('.menu-title').forEach(title => {
  title.addEventListener('click', () => {
    if (title.textContent === '-tools') {
      document.getElementById('tools-dropdown').classList.toggle('hidden');
    } else if (title.textContent === '-save') {
      saveCanvasAsPNG();
    }
  });
});

document.querySelectorAll('.submenu').forEach(sub => {
  sub.addEventListener('click', () => {
    document.getElementById('marker-submenu').classList.add('hidden');
    document.getElementById('eraser-submenu').classList.add('hidden');
    const panelId = `${sub.dataset.sub}-submenu`;
    document.getElementById(panelId).classList.remove('hidden');
    currentTool = sub.dataset.sub;
  });
});

// Marker settings
document.getElementById('marker-size').addEventListener('input', e => {
  markerSize = parseInt(e.target.value);
});
document.getElementById('color-picker').addEventListener('input', e => {
  color = e.target.value;
});

// Eraser settings
document.getElementById('eraser-size').addEventListener('input', e => {
  eraserSize = parseInt(e.target.value);
});

// Draggable tool panel
const panel = document.getElementById('tool-panel');
let isDragging = false, offsetX, offsetY;

panel.addEventListener('mousedown', (e) => {
  isDragging = true;
  offsetX = e.offsetX;
  offsetY = e.offsetY;
});

document.addEventListener('mousemove', (e) => {
  if (isDragging) {
    let x = e.clientX - offsetX;
    let y = e.clientY - offsetY;
    const container = document.getElementById('app-container');
    const rect = container.getBoundingClientRect();
    x = Math.max(rect.left, Math.min(rect.right - panel.offsetWidth, x));
    y = Math.max(rect.top, Math.min(rect.bottom - panel.offsetHeight, y));
    panel.style.left = `${x - rect.left}px`;
    panel.style.top = `${y - rect.top}px`;
  }
});

document.addEventListener('mouseup', () => isDragging = false);

// Save PNG (lossless, PNG-8 simulated)
function saveCanvasAsPNG() {
  const link = document.createElement('a');
  link.download = 'pixel-art.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}
