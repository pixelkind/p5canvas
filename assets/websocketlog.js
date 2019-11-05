let logs = [];
let socket;
function setupWebsocket(server) {
  socket = new WebSocket(server);

  socket.onerror = error => {
    console.log(error);
  };

  socket.onopen = event => {
    for (index in logs) {
      sendLog(logs[index].msg, logs[index].type);
    }
    logs = [];
  };

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
}

function addLog(msg, type) {
  if (typeof msg === "object") {
    msg = JSON.stringify(msg, null, 4);
  }

  if (socket != undefined && socket.readyState === 1) {
    sendLog(msg, type);
  } else {
    logs.push({msg: msg, type: type});
  }
}

window.console.log = msg => {
  addLog(msg, "log");
};
window.console.debug = msg => {
  addLog(msg, "debug");
};
window.console.error = msg => {
  addLog(msg, "error");
};
window.console.info = msg => {
  addLog(msg, "info");
};
window.console.trace = msg => {
  addLog(msg, "trace");
};
window.console.warn = msg => {
  addLog(msg, "warn");
};

function sendLog(msg, type) {
  socket.send(
    JSON.stringify({
      type: "log",
      msg: msg,
      logType: type
    })
  );
}
