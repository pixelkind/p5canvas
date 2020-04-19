let vscode;

function setupCommunication() {
  vscode = acquireVsCodeApi();

  window.addEventListener("message", (event) => {
    const message = event.data;

    if (message.type === "imageRequest") {
      let canvas = document.getElementById("p5canvas").firstChild;
      let data = canvas.toDataURL("image/png");
      vscode.postMessage({
        type: "imageData",
        mimeType: "png",
        data: data,
      });
    }
  });
}

function addLog(msg, type) {
  if (typeof msg === "object") {
    msg = JSON.stringify(msg, null, 4);
  }

  sendLog(msg, type);
}

window.console.log = (msg) => {
  addLog(msg, "log");
};
window.console.debug = (msg) => {
  addLog(msg, "debug");
};
window.console.error = (msg) => {
  addLog(msg, "error");
};
window.console.info = (msg) => {
  addLog(msg, "info");
};
window.console.trace = (msg) => {
  addLog(msg, "trace");
};
window.console.warn = (msg) => {
  addLog(msg, "warn");
};

function sendLog(msg, type) {
  vscode.postMessage({
    type: "log",
    msg: msg,
    logType: type,
  });
}
