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
      // var codeElement = document.getElementById('code')
      // var parent = codeElement.parent
      // var newCodeElement = document.createElement('script')
      // newCodeElement.src = event.data
      // socket.send(event.data)
      // parent.replaceChild(newCodeElement, codeElement)
      // codeElement.outerHTML = '<script id="code">' + event.data + '</script>'
      $('#code').replaceWith('<script id="code">' + event.data + '</script>')
    }
  }
}
