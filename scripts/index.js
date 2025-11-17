const checkbox = document.getElementById("enable");

chrome.storage.sync.get("enable", (res) => {
  checkbox.checked = !!res.enable;
});

checkbox.addEventListener("change", (e) => {
    console.log(e.target.checked);
  chrome.storage.sync.set({ enable: e.target.checked });
});