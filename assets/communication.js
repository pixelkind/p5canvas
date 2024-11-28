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

  window.addEventListener("error", (error) => {
    vscode.postMessage({
      type: "jsError",
      containedMessage: error.message,
      containedRawLine: error.lineno,
      containedRawColumn: error.colno,
    });
  });
}

window.addEventListener("load", setupCommunication);

function addLog(msg, type) {
  if (typeof msg === "object") {
    msg = JSON.stringify(msg, null, 4);
  }

  if (
    msg ===
    'You just changed the value of "createCanvas", which was a p5 function. This could cause problems later if you\'re not careful.'
  ) {
    return;
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
