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
document.documentElement.appendChild(style);
