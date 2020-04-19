"use strict";

import * as vscode from "vscode";
import {JSHINT} from "jshint";
import * as path from "path";
import * as fs from "fs";
import * as crypto from "crypto";

let outputChannel: vscode.OutputChannel;
let currentPanel: vscode.WebviewPanel | undefined = undefined;
let lastCodeHash: String = undefined;

export function activate(context: vscode.ExtensionContext) {
  lastCodeHash = undefined;
  let statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
  statusBarItem.text = `$(file-media) p5canvas`;
  statusBarItem.command = "extension.showCanvas";
  statusBarItem.show();

  outputChannel = vscode.window.createOutputChannel("p5canvas console");
  let lastKnownEditor = vscode.window.activeTextEditor;

  let changeTextDocument = vscode.workspace.onDidChangeTextDocument((e: vscode.TextDocumentChangeEvent) => {
    if (
      e &&
      e.document &&
      vscode.window.activeTextEditor != undefined &&
      e.document === vscode.window.activeTextEditor.document &&
      e.document.languageId == "javascript"
    ) {
      let editor = vscode.window.activeTextEditor;
      if (editor) {
        lastKnownEditor = editor;
        updateCode(lastKnownEditor, outputChannel);
      }
    }
  });

  let didChangeActiveEditor = vscode.window.onDidChangeActiveTextEditor((e: vscode.TextEditor) => {
    if (e && e.document && e.document.languageId == "javascript") {
      statusBarItem.show();
      let editor = vscode.window.activeTextEditor;
      if (editor) {
        lastKnownEditor = editor;
        updateCode(lastKnownEditor, outputChannel);
      }
    } else {
      statusBarItem.hide();
    }
  });

  let extensionPath = vscode.Uri.file(vscode.extensions.getExtension("garrit.p5canvas").extensionPath);
  let localPath = vscode.Uri.file(path.dirname(vscode.window.activeTextEditor.document.uri.path));

  let disposable = vscode.commands.registerCommand("extension.showCanvas", () => {
    outputChannel.show(true);
    if (currentPanel) {
      currentPanel.reveal(vscode.ViewColumn.Two);
    } else {
      let editor = vscode.window.activeTextEditor;
      if (editor) {
        lastKnownEditor = editor;
      }
      currentPanel = vscode.window.createWebviewPanel("p5canvas", "p5canvas", vscode.ViewColumn.Two, {
        enableScripts: true,
        localResourceRoots: [extensionPath, localPath],
      });
      lastCodeHash = undefined;
      currentPanel.webview.onDidReceiveMessage(handleMessage);
      currentPanel.webview.html = getWebviewContent();
      updateCode(lastKnownEditor, outputChannel);

      currentPanel.onDidDispose(
        () => {
          lastCodeHash = undefined;
          currentPanel = undefined;
        },
        undefined,
        context.subscriptions
      );
    }
  });

  let disposableSaveAsPNG = vscode.commands.registerCommand("extension.saveAsPNG", () => {
    currentPanel.webview.postMessage({
      type: "imageRequest",
      mimeType: "png",
    });
  });

  context.subscriptions.push(
    disposable,
    statusBarItem,
    disposableSaveAsPNG,
    changeTextDocument,
    didChangeActiveEditor,
    outputChannel
  );
}

function updateCode(editor: vscode.TextEditor, outputChannel: vscode.OutputChannel) {
  if (!editor) {
    console.log("Error: No document found");
    return;
  }
  let text = editor.document.getText();
  let hash = crypto.createHash("md5").update(text).digest("hex");
  if (lastCodeHash === hash) {
    return;
  }
  lastCodeHash = hash;
  let options = {
    esversion: 6,
  };
  JSHINT(text, options);

  if (JSHINT.errors.length == 0) {
    outputChannel.clear();
    currentPanel.webview.html = getWebviewContent(text);
  } else {
    let message = "🙊 Errors:\n";

    let es6error = false;
    JSHINT.errors.forEach((element) => {
      message += `Line ${element.line}, col ${element.character}: ${element.reason}\n`;
    });
    outputChannel.clear();
    outputChannel.append(message);
  }
}

function handleMessage(message) {
  if (message.type == "log") {
    switch (message.logType) {
      case "warn":
        outputChannel.appendLine("⚠️: " + message.msg);
        return;
      case "error":
        outputChannel.appendLine("🚫: " + message.msg);
        return;
      case "debug":
        outputChannel.appendLine("❗️: " + message.msg);
        return;
      case "trace":
        outputChannel.appendLine("🔎: " + message.msg);
        return;
      case "info":
        outputChannel.appendLine("ℹ️: " + message.msg);
        return;
      case "log":
        outputChannel.appendLine(message.msg);
        return;
    }
  } else if (message.type == "imageData") {
    if (message.mimeType == "png") {
      let imageData = message.data.replace(/^data:image\/png;base64,/, "");
      let options = {
        filters: {
          Images: ["png"],
        },
      };
      vscode.window.showSaveDialog(options).then((result) => {
        if (result) {
          let path = result.fsPath;
          fs.writeFile(path, imageData, "base64", (err) => {
            if (err) {
              vscode.window.showErrorMessage("Error saving the file: " + err);
            } else {
              vscode.window.showInformationMessage("The file has been saved.");
            }
          });
        }
      });
    }
  }
}

function getWebviewContent(code: String = "") {
  let extensionPath = vscode.Uri.file(vscode.extensions.getExtension("garrit.p5canvas").extensionPath).with({
    scheme: "vscode-resource",
  });

  let localPath = vscode.Uri.file(path.dirname(vscode.window.activeTextEditor.document.uri.path) + path.sep).with({
    scheme: "vscode-resource",
  });

  return `
  <!DOCTYPE html>
  <html>
    <head>
      <script src="${extensionPath}/assets/p5.min.js"></script>
      <script src="${extensionPath}/assets/communication.js"></script>
      <script src="${extensionPath}/assets/p5setup.js"></script>
      <script>window.localPath = "${localPath}";</script>
      <script src="${extensionPath}/assets/ruler.js"></script>
      <script>var p5rulersize = 20</script>
      <style>
      html {
          height: 100%;
      }
      body {
          height: 100%;
          display: flex;
          flex-direction: row;
          padding: 0;
          margin: 0;
      }
      .no-padding-no-margin {
          padding: 0;
          margin: 0;
      }
      .flex-col {
          flex-direction: column;
      }
      #ruler-horizontal {
          width: 100%;
          height: 20px;
      }
      #ruler-vertical {
          width: 20px;
          height: 100%;
      }
      canvas {
          display: block;
      }
    </style>
    </head>
    <body>
      <canvas id="ruler-vertical"></canvas>
      <div class="flex-col no-padding-no-margin">
        <canvas id="ruler-horizontal"></canvas>
        <div id="p5canvas"></div>
      </div>
      <script id="code">setTimeout(() => {
        var draw;
        var keyPressed, keyReleased, keyTyped;
        var mousePressed, mouseReleased, mouseClicked, doubleClicked;
        var mouseDragged, mouseMoved, mouseWheel;
        var touchesStarted, touchesMoved, touchesEnded;
        ${code}
        window.draw = draw;
        window.keyPressed = keyPressed;
        window.keyReleased = keyReleased;
        window.keyTyped = keyTyped;
        window.mousePressed = mousePressed;
        window.mouseReleased = mouseReleased;
        window.mouseClicked = mouseClicked;
        window.doubleClicked = doubleClicked;
        window.mouseDragged = mouseDragged;
        window.mouseMoved = mouseMoved;
        window.mouseWheel = mouseWheel;
        window.touchesStarted = touchesStarted;
        window.touchesMoved = touchesMoved;
        window.touchesEnded = touchesEnded;
      }, 1);</script>
    </body>
  </html>
  `;
}

export function deactivate() {
  return undefined;
}
