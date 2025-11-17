const enable = document.getElementById("enable");
const modeRadios = document.querySelectorAll('input[name="mode"]');
const whitelist = document.getElementById("whitelist");
const blacklist = document.getElementById("blacklist");

chrome.storage.sync.get(["enable", "mode", "whitelist", "blacklist"], (res) => {
  enable.checked = !!res.enable;

  const mode = res.mode || "all";
  document.querySelector(`input[name="mode"][value="${mode}"]`).checked = true;

  whitelist.value = (res.whitelist || []).join("\n");
  blacklist.value = (res.blacklist || []).join("\n");

  updateInputs(mode);
});

const inputMap = {
  all: { show: null },
  "block-only": { show: "blacklist" },
  "allow-only": { show: "whitelist" },
};

const updateInputs = (mode) => {
  const show = inputMap[mode].show;
  [whitelist, blacklist].forEach((el) => {
    el.disabled = true;
    el.style.display = "none";
  });

  if (show) {
    const el = document.getElementById(show);
    el.disabled = false;
    el.style.display = "block";
  }
};

enable.addEventListener("change", () => {
  chrome.storage.sync.set({ enable: enable.checked });
});

modeRadios.forEach((r) => {
  r.addEventListener("change", () => {
    chrome.storage.sync.set({ mode: r.value });
    updateInputs(r.value);
  });
});

whitelist.addEventListener("input", () => {
  const list = whitelist.value
    .split("\n")
    .map((v) => v.trim())
    .filter(Boolean);
  chrome.storage.sync.set({ whitelist: list });
});

blacklist.addEventListener("input", () => {
  const list = blacklist.value
    .split("\n")
    .map((v) => v.trim())
    .filter(Boolean);
  chrome.storage.sync.set({ blacklist: list });
});
