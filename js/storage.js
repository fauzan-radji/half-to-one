function storeSettings(settings) {
  localStorage.setItem("filterSettings", JSON.stringify(settings));
}

function loadSettings() {
  const settings = localStorage.getItem("filterSettings");
  return settings ? JSON.parse(settings) : null;
}
