const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const imageCanvas = document.getElementById("image");
const imageCtx = imageCanvas.getContext("2d", { willReadFrequently: true });

const settings = Settings.load();

const imageSource = "img/freya.jpg";
let filename = "freya.jpg";
const image = new Image();
image.src = imageSource;
image.style.display = "none";
document.body.appendChild(image);
let imageGray = null;
const maxImageSize = 900;
image.onload = () => {
  canvas.height = image.height;
  canvas.width = image.width;
  imageCanvas.height = image.height;
  imageCanvas.width = image.width;

  if (image.width > maxImageSize || image.height > maxImageSize) {
    const scale = Math.min(
      maxImageSize / image.width,
      maxImageSize / image.height
    );
    canvas.width = image.width * scale;
    canvas.height = image.height * scale;
    imageCanvas.width = image.width * scale;
    imageCanvas.height = image.height * scale;
  }

  imageCtx.drawImage(image, 0, 0, imageCanvas.width, imageCanvas.height);
  const imageData = imageCtx.getImageData(
    0,
    0,
    imageCanvas.width,
    imageCanvas.height
  );
  const pixels = imageData.data;
  const gray = [];
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const avg = (r + g + b) / 3;
    gray.push(avg);
  }

  imageGray = gray;
  draw();
};

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = settings.background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = settings.color;
  ctx.strokeStyle = settings.color;
  switch (settings.type) {
    case "stripe":
      drawStripe();
      break;

    case "hex":
      drawHex();
      break;

    default:
      drawDot();
      break;
  }
}

function drawHex() {
  const scaledSize = settings.size * 0.8;
  const cellHeight = (scaledSize * Math.sqrt(3)) / 2;
  const cellWidth = scaledSize;

  const cellsX = Math.ceil(canvas.width / cellWidth);
  const cellsY = Math.ceil(canvas.height / cellHeight);

  for (let y = 0; y <= cellsY; y++) {
    const scaledY = y * cellHeight;
    const pixelY = scaledY - cellHeight * 0.5;
    for (let x = 0; x <= cellsX; x++) {
      const scaledX = x * cellWidth;
      const pixelX = scaledX - cellWidth * (y % 2 == 0 ? 0.25 : 0.75);

      const startX = Math.round(pixelX);
      const startY = Math.round(pixelY);
      const endX = Math.round(pixelX + cellWidth);
      const endY = Math.round(pixelY + cellHeight);
      const averageGray = getAverageGrayInArea(
        imageCanvas.width,
        imageCanvas.height,
        imageGray,
        startX,
        startY,
        endX,
        endY
      );

      const grayness = averageGray / 255;
      const contrast = grayness ** settings.contrast;
      const invertedContrast = settings.invert ? 1 - contrast : contrast;
      const size = settings.size * (1 - invertedContrast);
      const offset = (settings.size - size) / 2;

      fillHexagon(pixelX + offset, pixelY + offset, size);
    }
  }
}

function drawDot() {
  const cellHeight = settings.size / 2;
  const cellWidth = settings.size;

  const cellsX = Math.ceil(canvas.width / cellWidth);
  const cellsY = Math.ceil(canvas.height / cellHeight);

  for (let y = 0; y <= cellsY; y++) {
    const scaledY = y * cellHeight;
    const pixelY = scaledY - cellHeight * 0.875;
    for (let x = 0; x <= cellsX; x++) {
      const scaledX = x * cellWidth;
      const pixelX = scaledX - cellWidth * (y % 2 == 0 ? 0.25 : 0.75);

      const startX = Math.round(pixelX);
      const startY = Math.round(pixelY);
      const endX = Math.round(pixelX + cellWidth);
      const endY = Math.round(pixelY + cellHeight);
      const averageGray = getAverageGrayInArea(
        imageCanvas.width,
        imageCanvas.height,
        imageGray,
        startX,
        startY,
        endX,
        endY
      );

      const grayness = averageGray / 255;
      const contrast = grayness ** settings.contrast;
      const invertedContrast = settings.invert ? 1 - contrast : contrast;
      const size = settings.size * (1 - invertedContrast);
      const offset = (settings.size - size) / 2;

      fillCircle(pixelX + offset, pixelY + offset, size, size);
    }
  }
}

function drawStripe() {
  const cellHeight = 1;
  const cellWidth = settings.size;

  const cellsX = Math.ceil(canvas.width / cellWidth);
  const cellsY = Math.ceil(canvas.height / cellHeight);

  for (let y = 0; y < cellsY; y++) {
    const pixelY = y * cellHeight;
    for (let x = 0; x < cellsX; x++) {
      const pixelX = x * cellWidth;

      const startX = Math.round(pixelX);
      const startY = Math.round(pixelY);
      const endX = Math.round(startX + cellWidth);
      const endY = Math.round(startY + cellHeight);
      const averageGray = getAverageGrayInArea(
        imageCanvas.width,
        imageCanvas.height,
        imageGray,
        startX,
        startY,
        endX,
        endY
      );

      const grayness = averageGray / 255;
      const contrast = grayness ** settings.contrast;
      const invertedContrast = settings.invert ? 1 - contrast : contrast;
      const size = settings.size * (1 - invertedContrast);
      const offset = (settings.size - size) / 2;

      ctx.fillRect(pixelX + offset, pixelY, size, cellHeight);
    }
  }
}

function fillCircle(x, y, diameter) {
  const radius = diameter / 2;
  ctx.beginPath();
  ctx.arc(x + radius, y + radius, radius, 0, Math.PI * 2);
  ctx.fill();
}

function fillDiamond(x, y, size) {
  const halfSize = size / 2;
  ctx.beginPath();
  ctx.moveTo(x + halfSize, y);
  ctx.lineTo(x + size, y + halfSize);
  ctx.lineTo(x + halfSize, y + size);
  ctx.lineTo(x, y + halfSize);
  ctx.closePath();
  ctx.fill();
}

function fillHexagon(x, y, size) {
  size = size * (1.2 * 0.8);
  const width = size;
  const height = (size * Math.sqrt(3)) / 1.5;
  const halfWidth = size / 2;
  const halfHeight = height / 2;
  const quarterHeight = height / 4;
  ctx.beginPath();
  ctx.moveTo(x, y + quarterHeight);
  ctx.lineTo(x + halfWidth, y);
  ctx.lineTo(x + width, y + quarterHeight);
  ctx.lineTo(x + width, y + quarterHeight + halfHeight);
  ctx.lineTo(x + halfWidth, y + height);
  ctx.lineTo(x, y + quarterHeight + halfHeight);
  ctx.closePath();
  ctx.fill();
}

let debounceTimeout = null;
const debounceDelay = 10;
function drawDebounced() {
  if (debounceTimeout) {
    clearTimeout(debounceTimeout);
  }
  debounceTimeout = setTimeout(() => {
    draw();
  }, debounceDelay);
}

function getAverageGrayInArea(width, height, gray, startX, startY, endX, endY) {
  if (!gray) return 0;
  let totalGray = 0;
  let count = 0;
  for (let y = startY; y < endY; y++) {
    for (let x = startX; x < endX; x++) {
      if (x >= 0 && x < width && y >= 0 && y < height) {
        const grayValue = gray[y * width + x];
        totalGray += grayValue;
        count++;
      }
    }
  }
  return totalGray / count;
}

const fileInput = document.getElementById("file");
fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = (event) => {
    image.src = event.target.result;
  };
  reader.readAsDataURL(file);
  filename = file.name;
});

const downloadButton = document.getElementById("download");
downloadButton.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = `${settings.type}-${filename}`;
  link.href = canvas.toDataURL();
  link.click();
});

const resetButton = document.getElementById("reset");
resetButton.addEventListener("click", () => {
  settings.reset();
  drawDebounced();
});

function drawPitchBlack() {
  imageGray = imageGray.map(() => 0);
  draw();
}
