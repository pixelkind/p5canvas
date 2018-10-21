var hRulerCanvas
var hRulerContext
var vRulerCanvas
var vRulerContext

function setupRulers() {
    hRulerCanvas = document.getElementById('ruler-horizontal')
    hRulerContext = hRulerCanvas.getContext('2d', { alpha: false })
    hRulerCanvas.width = hRulerCanvas.offsetWidth;
    hRulerCanvas.height = hRulerCanvas.offsetHeight;

    vRulerCanvas = document.getElementById('ruler-vertical')
    vRulerContext = vRulerCanvas.getContext('2d', { alpha: false })
    vRulerCanvas.width = vRulerCanvas.offsetWidth;
    vRulerCanvas.height = vRulerCanvas.offsetHeight;

    vRulerContext.fillStyle = '#FFFFFF'
    vRulerContext.fillRect(0, 0, vRulerCanvas.width, vRulerCanvas.height)

    hRulerContext.fillStyle = '#FFFFFF'
    hRulerContext.fillRect(0, 0, hRulerCanvas.width, hRulerCanvas.height)
}

function updateRulers(event) {
    hRulerContext.fillStyle = '#FFFFFF'
    hRulerContext.fillRect(0, 0, hRulerCanvas.width, hRulerCanvas.height)

    hRulerContext.strokeStyle = '#333333'
    hRulerContext.lineWidth = 1
    hRulerContext.beginPath()
    hRulerContext.moveTo(0, p5rulersize)
    hRulerContext.lineTo(hRulerCanvas.width, p5rulersize)
    hRulerContext.stroke()

    for (var x = 0; x < hRulerCanvas.width; x += 5) {
        hRulerContext.beginPath()
        hRulerContext.moveTo(x - 0.5, p5rulersize)
        hRulerContext.lineTo(x - 0.5, p5rulersize - 4)
        hRulerContext.stroke()
    }

    for (var x = 0; x < hRulerCanvas.width; x += 10) {
        hRulerContext.beginPath()
        hRulerContext.moveTo(x - 0.5, p5rulersize)
        hRulerContext.lineTo(x - 0.5, p5rulersize - 7)
        hRulerContext.stroke()
    }

    hRulerContext.fillStyle = '#333333'
    hRulerContext.font = '8px sans-serif'
    hRulerContext.textBaseline = 'top'

    for (var x = 0; x < hRulerCanvas.width; x += 100) {
        hRulerContext.beginPath()
        hRulerContext.moveTo(x - 0.5, p5rulersize)
        hRulerContext.lineTo(x - 0.5, 0)
        hRulerContext.stroke()

        hRulerContext.fillText(x.toFixed(0), x + 3, 1)
    }

    let hRulerCanvasRect = hRulerCanvas.getBoundingClientRect()

    hRulerContext.strokeStyle = '#FF0000'
    hRulerContext.beginPath()
    hRulerContext.moveTo(event.pageX - hRulerCanvasRect.left - 0.5, 0)
    hRulerContext.lineTo(event.pageX - hRulerCanvasRect.left - 0.5, p5rulersize)
    hRulerContext.stroke()

    vRulerContext.fillStyle = '#FFFFFF'
    vRulerContext.fillRect(0, 0, vRulerCanvas.width, vRulerCanvas.height)

    vRulerContext.strokeStyle = '#333333'
    vRulerContext.lineWidth = 1
    vRulerContext.beginPath()
    vRulerContext.moveTo(p5rulersize, 0)
    vRulerContext.lineTo(p5rulersize, vRulerCanvas.height)
    vRulerContext.stroke()

    for (var y = p5rulersize; y < vRulerCanvas.height; y += 5) {
        vRulerContext.beginPath()
        vRulerContext.moveTo(p5rulersize, y - 0.5)
        vRulerContext.lineTo(p5rulersize - 4, y - 0.5)
        vRulerContext.stroke()
    }

    for (var y = p5rulersize; y < vRulerCanvas.height; y += 10) {
        vRulerContext.beginPath()
        vRulerContext.moveTo(p5rulersize, y - 0.5)
        vRulerContext.lineTo(p5rulersize - 7, y - 0.5)
        vRulerContext.stroke()
    }

    for (var y = p5rulersize; y < vRulerCanvas.height; y += 100) {
        vRulerContext.beginPath()
        vRulerContext.moveTo(p5rulersize, y - 0.5)
        vRulerContext.lineTo(0, y - 0.5)
        vRulerContext.stroke()
    }

    vRulerContext.strokeStyle = '#FF0000'
    vRulerContext.beginPath()
    vRulerContext.moveTo(0, event.pageY - 0.5)
    vRulerContext.lineTo(p5rulersize, event.pageY - 0.5)
    vRulerContext.stroke()
}