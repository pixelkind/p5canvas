function setupWebsocket (server) {
  const socket = new WebSocket(server)

  socket.onerror = (error) => {
    console.log(error)
  }

  socket.onopen = (event) => {
    window.console.log = (msg) => {
      socket.send(msg)
    }

    socket.onmessage = (event) => {
      $('#code').replaceWith('<script id="code">clear();' + event.data + '\nproductionize(this);</script>')
    }
  }
}
