function p5setup() {
  // Override the loadImage method from p5js to enable the usage of relative paths
  // This method must be overriden inside of setup
  let loadImageSuper = window.loadImage;
  window.loadImage = (path, successCallback, failureCallback) => {
    if (!path.startsWith("vscode-webview-resource:") && !path.startsWith("http")) {
      path = decodeURI(window.localPath) + path;
    }
    return loadImageSuper.apply(this, [path, successCallback, failureCallback]);
  };

  var p5canvas = createCanvas(innerWidth - p5rulersize, innerHeight - p5rulersize);
  p5canvas.parent("p5canvas");
  frameRate(30);
  clear();

  runCode();
  if (window._customPreload !== undefined) {
    window._customPreload();
  }
}

function resizeCanvasHandler() {
  resizeCanvas(innerWidth - p5rulersize, innerHeight - p5rulersize);
  if (p5 !== undefined) {
    clear();
  }
}
window.addEventListener("resize", resizeCanvasHandler);

let width = window.innerWidth;
let height = window.innerHeight;

function loadHandler() {
  window.setup = p5setup;

  new p5();
}

window.addEventListener("load", loadHandler);
