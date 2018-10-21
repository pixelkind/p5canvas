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

    drawHorizontalRuler()
    drawVerticalRuler()

    window.addEventListener('resize', updateWindowSize)
}

function updateWindowSize() {
    hRulerCanvas.width = hRulerCanvas.offsetWidth;
    hRulerCanvas.height = hRulerCanvas.offsetHeight;

    vRulerCanvas.width = vRulerCanvas.offsetWidth;
    vRulerCanvas.height = vRulerCanvas.offsetHeight;

    drawHorizontalRuler()
    drawVerticalRuler()
}

function drawHorizontalRuler() {
    var ctx = hRulerContext

    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, hRulerCanvas.width, hRulerCanvas.height)

    ctx.strokeStyle = '#333333'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, p5rulersize)
    ctx.lineTo(hRulerCanvas.width, p5rulersize)
    ctx.stroke()

    for (var x = 0; x < hRulerCanvas.width; x += 5) {
        ctx.beginPath()
        ctx.moveTo(x - 0.5, p5rulersize)
        ctx.lineTo(x - 0.5, p5rulersize - 4)
        ctx.stroke()
    }

    for (var x = 0; x < hRulerCanvas.width; x += 10) {
        ctx.beginPath()
        ctx.moveTo(x - 0.5, p5rulersize)
        ctx.lineTo(x - 0.5, p5rulersize - 7)
        ctx.stroke()
    }

    ctx.fillStyle = '#333333'
    ctx.font = '9px sans-serif'
    ctx.textBaseline = 'top'

    for (var x = 0; x < hRulerCanvas.width; x += 100) {
        ctx.beginPath()
        ctx.moveTo(x - 0.5, p5rulersize)
        ctx.lineTo(x - 0.5, 0)
        ctx.stroke()

        if (x > 0) {
            ctx.fillText(x.toFixed(0), x + 3, 1)
        }
    }
}

function drawVerticalRuler() {
    var ctx = vRulerContext

    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, vRulerCanvas.width, vRulerCanvas.height)

    ctx.strokeStyle = '#333333'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(p5rulersize, 0)
    ctx.lineTo(p5rulersize, vRulerCanvas.height)
    ctx.stroke()

    for (var y = p5rulersize; y < vRulerCanvas.height; y += 5) {
        ctx.beginPath()
        ctx.moveTo(p5rulersize, y - 0.5)
        ctx.lineTo(p5rulersize - 4, y - 0.5)
        ctx.stroke()
    }

    for (var y = p5rulersize; y < vRulerCanvas.height; y += 10) {
        ctx.beginPath()
        ctx.moveTo(p5rulersize, y - 0.5)
        ctx.lineTo(p5rulersize - 7, y - 0.5)
        ctx.stroke()
    }

    ctx.fillStyle = '#333333'
    ctx.font = '9px sans-serif'
    ctx.textBaseline = 'top'

    for (var y = p5rulersize; y < vRulerCanvas.height; y += 100) {
        ctx.beginPath()
        ctx.moveTo(p5rulersize, y - 0.5)
        ctx.lineTo(0, y - 0.5)
        ctx.stroke()

        if (y > p5rulersize) {
            ctx.save()
            ctx.translate(0, y)
            ctx.rotate(-Math.PI/2)
            ctx.fillText((y - p5rulersize).toFixed(0), 3, 1)
            ctx.restore()
        }
    }
}

function updateRulers(event) {
    drawHorizontalRuler()

    let hRulerCanvasRect = hRulerCanvas.getBoundingClientRect()

    hRulerContext.strokeStyle = '#FF0000'
    hRulerContext.beginPath()
    hRulerContext.moveTo(event.pageX - hRulerCanvasRect.left - 0.5, 0)
    hRulerContext.lineTo(event.pageX - hRulerCanvasRect.left - 0.5, p5rulersize)
    hRulerContext.stroke()

    drawVerticalRuler()

    vRulerContext.strokeStyle = '#FF0000'
    vRulerContext.beginPath()
    vRulerContext.moveTo(0, event.pageY - 0.5)
    vRulerContext.lineTo(p5rulersize, event.pageY - 0.5)
    vRulerContext.stroke()
}