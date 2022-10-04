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

  let loadShaderSuper = window.loadShader;
  window.loadShader = (vertFilename, fragFilename, callback, errorCallback) => {
    if (!vertFilename.startsWith("vscode-webview-resource:") && !vertFilename.startsWith("http")) {
      vertFilename = decodeURI(window.localPath) + vertFilename;
    }
    if (!fragFilename.startsWith("vscode-webview-resource:") && !fragFilename.startsWith("http")) {
      fragFilename = decodeURI(window.localPath) + fragFilename;
    }
    // Add preload check to make sure that shaders have been loaded and compiled... otherwise we will still have an error
    return loadShaderSuper.apply(this, [vertFilename, fragFilename, callback, errorCallback]);
  };

  window._enableResize = true;
  let createCanvasSuper = window.createCanvas;
  window.createCanvas = (w, h, renderer) => {
    document.getElementById("p5canvas").innerHTML = "";
    if (w !== undefined && h !== undefined) {
      window._enableResize = false;
    }
    if (w === undefined) {
      w = innerWidth - p5rulersize;
    }
    if (h === undefined) {
      h = innerHeight - p5rulersize;
    }
    let p5canvas = createCanvasSuper(w, h, renderer);
    p5canvas.parent("p5canvas");
    return p5canvas;
  };

  createCanvas();
  frameRate(30);
  clear();

  runCode();
  if (window._customPreload !== undefined) {
    window._customPreload();
  }
  if (window._customSetup !== undefined) {
    window._customSetup();
  }
}

function resizeCanvasHandler() {
  if (window._enableResize) {
    resizeCanvas(innerWidth - p5rulersize, innerHeight - p5rulersize);
    if (p5 !== undefined) {
      clear();
    }
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
