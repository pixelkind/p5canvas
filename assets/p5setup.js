function setup() {
  createCanvas(windowWidth, windowHeight)
  frameRate(30)
  clear()
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight)
  clear()
}

function p5reset() {
  clear()
  fill(255, 255, 255)
  stroke(0, 0, 0)
  textSize(12)
}
