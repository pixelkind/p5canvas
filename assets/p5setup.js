function setup() {
  // Override the loadImage method from p5js to enable the usage of relative paths
  // This method must be overriden inside of setup
  let loadImageSuper = loadImage;
  loadImage = (path, successCallback, failureCallback) => {
    if (!path.startsWith("file:") && !path.startsWith("http")) {
      path = decodeURI(localPath) + path;
    }
    return loadImageSuper.apply(this, [path, successCallback, failureCallback]);
  };

  var p5canvas = createCanvas(windowWidth - p5rulersize, windowHeight - p5rulersize);
  p5canvas.parent("p5canvas");
  frameRate(30);
  clear();
}

function resizeCanvas() {
  resizeCanvas(windowWidth - p5rulersize, windowHeight - p5rulersize);
  clear();
}
window.addEventListener("resize", resizeCanvas);

function p5reset() {
  clear();
  fill(255, 255, 255);
  stroke(0, 0, 0);
  strokeWeight(1);
  textSize(12);
}

new p5();
var width = windowWidth;
var height = windowHeight;
