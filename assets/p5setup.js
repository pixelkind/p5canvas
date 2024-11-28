function p5setup() {
  // Override the loadImage method from p5js to enable the usage of relative paths
  // This method must be overriden inside of setup
  let loadImageSuper = window.loadImage;
  window.loadImage = (path, successCallback, failureCallback) => {
    if (
      !path.startsWith("vscode-webview-resource:") &&
      !path.startsWith("http")
    ) {
      path = decodeURI(window.localPath) + path;
    }
    return loadImageSuper.apply(this, [path, successCallback, failureCallback]);
  };

  // Override the loadFont method from p5js to enable the usage of relative paths
  // This method must be overriden inside of setup
  let loadFontSuper = window.loadFont;
  window.loadFont = (path, successCallback, failureCallback) => {
    if (
      !path.startsWith("vscode-webview-resource:") &&
      !path.startsWith("http")
    ) {
      path = decodeURI(window.localPath) + path;
    }
    return loadFontSuper.apply(this, [path, successCallback, failureCallback]);
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
    width = w;
    height = h;
    p5canvas.parent("p5canvas");
    return p5canvas;
  };

  /** gets the p5 friendly error system error messages into our console */
  p5._fesLogger = (p5friendlyError) => {
    const ERROR_PARSER = /\[(index\.html[^\s]+,\s*)line\s*(\d+)\]/;
    const results = ERROR_PARSER.exec(p5friendlyError);

    let p5evenFriendlierError = p5friendlyError.trim();
    if (results) {
      p5evenFriendlierError = p5evenFriendlierError
        .replace(results[1], "")
        .replace(
          results[2],
          results[2] - window.PRECEDING_LINES_IN_SCRIPT_TAG - 1
        ); // why -1? who knows?
    }
    addLog(p5evenFriendlierError, "log");
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

let width;
let height;

function loadHandler() {
  window.setup = p5setup;

  new p5();
}

window.addEventListener("load", loadHandler);
