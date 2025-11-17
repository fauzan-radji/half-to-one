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
densitySlider.addEventListener("input", (e) => {
  const value = parseInt(e.target.value);
  const max = +densitySlider.max;
  const min = +densitySlider.min;
  settings.size = max - value + min;
});

const contrastSlider = document.getElementById("contrast");
contrastSlider.addEventListener("input", (e) => {
  const value = parseFloat(e.target.value);
  settings.contrast = value;
});

const color1Input = document.getElementById("color1");
const hex1Input = document.getElementById("hex1");
const color2Input = document.getElementById("color2");
const hex2Input = document.getElementById("hex2");
const swapButton = document.getElementById("swap");

swapButton.addEventListener("click", () => {
  const currentColor = color1Input.value;
  const currentBackground = color2Input.value;
  settings.color = currentBackground;
  settings.background = currentColor;
});
color1Input.addEventListener("input", (e) => {
  settings.color = e.target.value;
});
color2Input.addEventListener("input", (e) => {
  settings.background = e.target.value;
});
hex1Input.addEventListener("input", (e) => {
  if (e.target.value.length !== 7) return;
  settings.color = e.target.value;
});
hex2Input.addEventListener("input", (e) => {
  if (e.target.value.length !== 7) return;
  settings.background = e.target.value;
});

const styles = document.querySelectorAll(".styles input[type='radio']");
styles.forEach((style) => {
  style.addEventListener("input", () => {
    if (!style.checked) return;
    settings.type = style.value;
  });
});

const invertCheckbox = document.getElementById("invert");
invertCheckbox.addEventListener("input", () => {
  settings.invert = invertCheckbox.checked;
});

settings.observe(({ size, contrast, color, background, type, invert }) => {
  const max = +densitySlider.max;
  const min = +densitySlider.min;
  densitySlider.value = min - size + max;
  contrastSlider.value = contrast;

  color1Input.value = color;
  hex1Input.value = color;
  color2Input.value = background;
  hex2Input.value = background;

  styles.forEach((style) => {
    if (style.value != type) return;
    style.checked = true;
  });

  invertCheckbox.checked = invert;

  drawDebounced();
});
