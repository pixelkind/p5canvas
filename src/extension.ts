"use strict";

import * as vscode from "vscode";
import {TextDocumentContentProvider} from "./TextDocumentContentProvider";
import {WebSocketServer, ImageType} from "./WebSocketServer";
import {JSHINT} from "jshint";
import * as path from "path";
import * as fs from "fs";

var websocket: WebSocketServer;
var counter: number = 0;
let server: string = "";

export function activate(context: vscode.ExtensionContext) {
  let currentPanel: vscode.WebviewPanel | undefined = undefined;
  let statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
  statusBarItem.text = `$(file-media) p5canvas`;
  statusBarItem.command = "extension.showCanvas";
  statusBarItem.show();

  let provider = new TextDocumentContentProvider();
  let registration = vscode.workspace.registerTextDocumentContentProvider("p5canvas", provider);

  let outputChannel = vscode.window.createOutputChannel("p5canvas console");
  websocket = new WebSocketServer(outputChannel);
  websocket.onListening = () => {
    provider.server = websocket.url;
    server = websocket.url;
  };

  let lastKnownEditor = vscode.window.activeTextEditor;

  websocket.onConnection = () => {
    outputChannel.show(true);
    if (lastKnownEditor && lastKnownEditor.document) {
      updateCode(lastKnownEditor, websocket, outputChannel);
    }
  };

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
        updateCode(lastKnownEditor, websocket, outputChannel);
      }
    }
  });

  let didChangeActiveEditor = vscode.window.onDidChangeActiveTextEditor((e: vscode.TextEditor) => {
    if (e && e.document && e.document.languageId == "javascript") {
      statusBarItem.show();
      let editor = vscode.window.activeTextEditor;
      if (editor) {
        lastKnownEditor = editor;
        updateCode(lastKnownEditor, websocket, outputChannel);
      }
    } else {
      statusBarItem.hide();
    }
  });

  let extensionPath = vscode.Uri.file(vscode.extensions.getExtension("garrit.p5canvas").extensionPath);
  let localPath = vscode.Uri.file(path.dirname(vscode.window.activeTextEditor.document.uri.path));

  let disposable = vscode.commands.registerCommand("extension.showCanvas", () => {
    if (currentPanel) {
      currentPanel.reveal(vscode.ViewColumn.Two);
    } else {
      currentPanel = vscode.window.createWebviewPanel("p5canvas", "p5canvas", vscode.ViewColumn.Two, {
        enableScripts: true,
        localResourceRoots: [extensionPath, localPath]
      });
      currentPanel.webview.html = getWebviewContent();
      currentPanel.onDidDispose(
        () => {
          currentPanel = undefined;
        },
        undefined,
        context.subscriptions
      );
    }
  });

  let disposableSaveAsPNG = vscode.commands.registerCommand("extension.saveAsPNG", () => {
    websocket.sendImageRequest(ImageType.png);
  });

  context.subscriptions.push(
    disposable,
    statusBarItem,
    disposableSaveAsPNG,
    changeTextDocument,
    didChangeActiveEditor,
    outputChannel,
    registration
  );
}

function updateCode(editor, websocket, outputChannel, es6 = false) {
  if (!editor) {
    console.log("Error: No document found");
    return;
  }
  let text = editor.document.getText();
  if (es6) {
    text = "/*jshint esversion: 6 */" + text;
  }
  JSHINT(text);

  if (JSHINT.errors.length == 0) {
    outputChannel.clear();
    websocket.sendCode(text);
  } else {
    let message = "🙊 Errors:\n";

    let es6error = false;
    JSHINT.errors.forEach(element => {
      message += `Line ${element.line}, col ${element.character}: ${element.reason}\n`;
      if (element.reason.contains("available in ES6 (use 'esversion: 6')")) {
        es6error = true;
      }
    });
    outputChannel.clear();
    outputChannel.append(message);
    if (es6error) {
      updateCode(editor, websocket, outputChannel, true);
    }
  }
}

function getWebviewContent() {
  let extensionPath = vscode.Uri.file(vscode.extensions.getExtension("garrit.p5canvas").extensionPath).with({
    scheme: "vscode-resource"
  });

  let localPath = vscode.Uri.file(path.dirname(vscode.window.activeTextEditor.document.uri.path) + path.sep).with({
    scheme: "vscode-resource"
  });

  return `
  <!DOCTYPE html>
  <html>
    <head>
      <script src="${extensionPath}/assets/p5.min.js"></script>
      <script src="${extensionPath}/assets/p5.sound.min.js"></script>
      <script src="${extensionPath}/assets/jquery-3.2.1.min.js"></script>
      <script src="${extensionPath}/assets/websocketlog.js">
      </script><script>setupWebsocket("${server}");</script>
      <script src="${extensionPath}/assets/errorHandler.js"></script>
      <script src="${extensionPath}/assets/p5setup.js"></script>
      <script>window.localPath = "${localPath}";</script>
      <script src="${extensionPath}/assets/ruler.js"></script>
      <script>var p5rulersize = 20</script>
      <script id="code"></script>
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
    <body onload="setupRulers();" onmousemove="updateRulers(event);">
      <canvas id="ruler-vertical"></canvas>
      <div class="flex-col no-padding-no-margin">
        <canvas id="ruler-horizontal"></canvas>
        <div id="p5canvas"></div>
      </div>
    </body>
  </html>
  `;
}

export function deactivate() {
  websocket.dispose();
  websocket = null;
  return undefined;
}
