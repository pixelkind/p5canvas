function setupWebsocket (server) {
  const socket = new WebSocket(server)

  socket.onerror = (error) => {
    console.log(error)
  }

  socket.onopen = (event) => {
    window.console.log = (msg) => {
      if(typeof msg == 'object') {
        msg = JSON.stringify(msg, null, 4)
      }

      socket.send(JSON.stringify({
        'type': 'log',
        'msg': msg
      }))
    }

    socket.onmessage = (event) => {
      let obj = JSON.parse(event.data)
      if (obj.type == 'code') {
        $('#code').replaceWith('<script id="code">function draw() {}; p5reset();' + obj.data + '\nproductionize(this);</script>')
      }
    }
  }
}
