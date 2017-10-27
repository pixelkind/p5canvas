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

      socket.send(msg)
    }

    socket.onmessage = (event) => {
      $('#code').replaceWith('<script id="code">clear();' + event.data + '\nproductionize(this);</script>')
    }
  }
}
