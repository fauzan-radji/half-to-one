class Settings {
  #type;
  #size;
  #color;
  #background;
  #contrast;
  #invert;
  #observers = [];

  constructor() {
    this.#type = "dot";
    this.#size = 20;
    this.#color = "#000000";
    this.#background = "#ffffff";
    this.#contrast = 1;
    this.#invert = false;
  }

  get type() {
    return this.#type;
  }

  set type(value) {
    if (this.#type === value) return;
    this.#type = value;
    this.#store();
    this.#observers.forEach((callback) => callback(this));
  }

  get size() {
    return this.#size;
  }

  set size(value) {
    if (this.#size === value) return;
    this.#size = value;
    this.#store();
    this.#observers.forEach((callback) => callback(this));
  }

  get color() {
    return this.#color;
  }

  set color(value) {
    if (this.#color === value) return;
    this.#color = value;
    this.#store();
    this.#observers.forEach((callback) => callback(this));
  }

  get background() {
    return this.#background;
  }

  set background(value) {
    if (this.#background === value) return;
    this.#background = value;
    this.#store();
    this.#observers.forEach((callback) => callback(this));
  }

  get contrast() {
    return this.#contrast;
  }

  set contrast(value) {
    if (this.#contrast === value) return;
    this.#contrast = value;
    this.#store();
    this.#observers.forEach((callback) => callback(this));
  }

  get invert() {
    return this.#invert;
  }

  set invert(value) {
    if (this.#invert === value) return;
    this.#invert = value;
    this.#store();
    this.#observers.forEach((callback) => callback(this));
  }

  observe(callback) {
    this.#observers.push(callback);
    callback(this);
  }

  static load() {
    const stored = localStorage.getItem("half-to-one-settings");
    if (stored) {
      const parsed = JSON.parse(stored);
      const settings = new Settings();
      Object.assign(settings, parsed);
      return settings;
    }
    return new Settings();
  }

  #store() {
    localStorage.setItem("half-to-one-settings", JSON.stringify(this));
  }

  toJSON() {
    return {
      type: this.#type,
      size: this.#size,
      color: this.#color,
      background: this.#background,
      contrast: this.#contrast,
      invert: this.#invert,
    };
  }

  reset() {
    localStorage.removeItem("half-to-one-settings");
    const defaultSettings = new Settings();
    this.type = defaultSettings.type;
    this.size = defaultSettings.size;
    this.color = defaultSettings.color;
    this.background = defaultSettings.background;
    this.contrast = defaultSettings.contrast;
    this.invert = defaultSettings.invert;
  }
}
