const slider = document.getElementById("slider");
const wrapper = document.getElementById("wrapper");
const mouse = {
  pressed: false,
  x: 0,
};
slider.addEventListener("mousedown", mousedown);
slider.addEventListener("touchstart", mousedown);
window.addEventListener("mouseup", mouseup);
window.addEventListener("touchend", mouseup);
window.addEventListener("mousemove", (e) =>
  mousemove(e.target, e.offsetX, e.clientX)
);
window.addEventListener("touchmove", (e) =>
  mousemove(e.touches[0].target, e.touches[0].offsetX, e.touches[0].clientX)
);

function mousedown() {
  mouse.pressed = true;
  slider.style.pointerEvents = "none";
  document.documentElement.style.cursor = "ew-resize";
}

function mouseup() {
  mouse.pressed = false;
  slider.style.pointerEvents = "auto";
  document.documentElement.style.cursor = "default";
}

function mousemove(target, offsetX, clientX) {
  if (mouse.pressed) {
    if (target !== wrapper) {
      const rect = wrapper.getBoundingClientRect();
      mouse.x = clientX - rect.left;
    } else {
      mouse.x = offsetX;
    }
    mouse.x = Math.max(0, Math.min(wrapper.clientWidth, mouse.x));

    const percentage = mouse.x / wrapper.clientWidth;
    document.documentElement.style.setProperty(
      "--percentage",
      `${percentage * 100}%`
    );
  }
}

const densitySlider = document.getElementById("density");
const min = 8;
const max = 40;
densitySlider.value = max - stripe.width + min;
densitySlider.addEventListener("input", (e) => {
  const value = parseInt(e.target.value);
  stripe.width = max - value + min;
  storeSettings(stripe);
  drawDebounced();
});

const contrastSlider = document.getElementById("contrast");
contrastSlider.value = stripe.contrast;
contrastSlider.addEventListener("input", (e) => {
  const value = parseFloat(e.target.value);
  stripe.contrast = value;
  storeSettings(stripe);
  drawDebounced();
});

const color1Input = document.getElementById("color1");
const hex1Input = document.getElementById("hex1");
const color2Input = document.getElementById("color2");
const hex2Input = document.getElementById("hex2");
const swapButton = document.getElementById("swap");

color1Input.value = stripe.color;
hex1Input.value = stripe.color;
color2Input.value = stripe.background;
hex2Input.value = stripe.background;

swapButton.addEventListener("click", () => {
  const temp = color1Input.value;
  color1Input.value = color2Input.value;
  color2Input.value = temp;
  stripe.color = color1Input.value;
  stripe.background = color2Input.value;
  hex1Input.value = stripe.color;
  hex2Input.value = stripe.background;
  storeSettings(stripe);
  drawDebounced();
});
color1Input.addEventListener("input", (e) => {
  stripe.color = e.target.value;
  hex1Input.value = e.target.value;
  storeSettings(stripe);
  drawDebounced();
});
color2Input.addEventListener("input", (e) => {
  stripe.background = e.target.value;
  hex2Input.value = e.target.value;
  storeSettings(stripe);
  drawDebounced();
});
hex1Input.addEventListener("input", (e) => {
  if (e.target.value.length !== 7) return;
  stripe.color = e.target.value;
  color1Input.value = e.target.value;
  storeSettings(stripe);
  drawDebounced();
});
hex2Input.addEventListener("input", (e) => {
  if (e.target.value.length !== 7) return;
  stripe.background = e.target.value;
  color2Input.value = e.target.value;
  storeSettings(stripe);
  drawDebounced();
});
