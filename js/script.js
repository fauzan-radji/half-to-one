const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const imageCanvas = document.getElementById("image");
const imageCtx = imageCanvas.getContext("2d");

const stripe = loadSettings() || {
  width: 20,
  height: 1,
  color: "#000000",
  background: "#ffffff",
  contrast: 1,
};

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
  draw(imageGray);
};

function draw() {
  ctx.fillStyle = stripe.background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = stripe.color;

  const cellsX = Math.ceil(canvas.width / stripe.width);
  const cellsY = Math.ceil(canvas.height / stripe.height);

  for (let y = 0; y < cellsY; y++) {
    for (let x = 0; x < cellsX; x++) {
      const startX = x * stripe.width;
      const startY = y * stripe.height;
      const endX = (x + 1) * stripe.width;
      const endY = (y + 1) * stripe.height;
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
      const contrast = grayness ** stripe.contrast;
      const width = stripe.width * (1 - contrast);
      const offsetX = (stripe.width - width) / 2;

      ctx.fillRect(
        x * stripe.width + offsetX,
        y * stripe.height,
        width,
        stripe.height
      );
    }
  }
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
  link.download = `striped-${filename}`;
  link.href = canvas.toDataURL();
  link.click();
});

const samples = document.querySelectorAll(".samples img");
samples.forEach((sample) => {
  sample.addEventListener("click", () => {
    image.src = sample.src;
  });
});
