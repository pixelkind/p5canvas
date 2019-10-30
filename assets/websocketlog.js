let logs = [];
let socket;
function setupWebsocket(server) {
  socket = new WebSocket(server);

  socket.onerror = error => {
    console.log(error);
  };

  socket.onopen = event => {
    for (index in logs) {
      sendLog(logs[index]);
    }
    logs = [];

    socket.onmessage = event => {
      let obj = JSON.parse(event.data);
      if (obj.type === "imageRequest") {
        let canvas = document.getElementById("p5canvas").firstChild;
        let data = canvas.toDataURL("image/png");
        socket.send(
          JSON.stringify({
            type: "imageData",
            mimeType: "png",
            data: data
          })
        );
      }
    };
  };
}

window.console.log = msg => {
  if (typeof msg === "object") {
    msg = JSON.stringify(msg, null, 4);
  }

  if (socket.isOpen) {
    sendLog(msg);
  } else {
    logs.push(msg);
  }
};
window.console.debug = window.console.log;
window.console.error = window.console.log;
window.console.info = window.console.log;
window.console.trace = window.console.log;
window.console.warn = window.console.log;

function sendLog(msg) {
  socket.send(
    JSON.stringify({
      type: "log",
      msg: msg
    })
  );
}
