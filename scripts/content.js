const css = `
  img {
    filter: blur(100px) !important;
  }
  *[style*="background-image"] {
    filter: blur(100px) !important;
  }
  * {
    background-image: none !important;
    -webkit-mask-image: none !important;
    mask-image: none !important;
  }

  [data-testid="videoComponent"] img, video {
    opacity: 0 !important;
  }
`;

const style = document.createElement("style");
style.textContent = css;

const normalizeDomain = (v) => {
  if (!v) return "";

  return v
    .toLowerCase()
    .trim()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*$/, "");
};

const toggleStyle = (enabled) => {
  console.log(enabled);
  if (enabled) {
    if (!style.isConnected) {
      console.log("append");
      document.documentElement.appendChild(style);
    }
  } else {
    if (style.isConnected) {
      style.remove();
    }
  }
};

const hostname = location.hostname.replace(/^www\./, "");

const applySettings = (settings) => {
  if (!settings || typeof settings !== "object") {
    toggleStyle(false);
    return;
  }

  const {
    enable = false,
    mode = "all",
    whitelist = [],
    blacklist = [],
  } = settings;

  if (!enable) {
    toggleStyle(false);
    return;
  }

  const shouldBlock = shouldBlockImages(
    {
      mode,
      whitelist: (Array.isArray(whitelist) ? whitelist : []).map(
        normalizeDomain
      ),
      blacklist: (Array.isArray(blacklist) ? blacklist : []).map(
        normalizeDomain
      ),
    },
    hostname
  );

  toggleStyle(shouldBlock);
};

chrome.storage.sync.get(["enable", "mode", "whitelist", "blacklist"], (res) => {
  applySettings(res);
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "sync") return;

  chrome.storage.sync.get(
    ["enable", "mode", "whitelist", "blacklist"],
    (res) => {
      applySettings(res);
    }
  );
});

const shouldBlockImages = ({ mode, whitelist, blacklist }, hostname) => {
  switch (mode) {
    case "all":
      return true;

    case "block-only":
      return Array.isArray(blacklist) && blacklist.includes(hostname);

    case "allow-only":
      return !(Array.isArray(whitelist) && whitelist.includes(hostname));

    default:
      return false;
  }
};
