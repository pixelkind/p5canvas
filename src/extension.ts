'use strict';

import * as vscode from 'vscode';
import { TextDocumentContentProvider } from './TextDocumentContentProvider';
import { WebSocketServer } from './WebSocketServer';

export function activate(context: vscode.ExtensionContext) {
    
    let previewUri = vscode.Uri.parse('p5canvas://authority/p5canvas');

    let statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    statusBarItem.text = `$(file-media) p5canvas`;
    statusBarItem.command = 'extension.showCanvas';
    statusBarItem.show();

    let provider = new TextDocumentContentProvider();
	let registration = vscode.workspace.registerTextDocumentContentProvider('p5canvas', provider);

    let outputChannel = vscode.window.createOutputChannel('p5canvas console');
    let websocket = new WebSocketServer(outputChannel);
    websocket.onListening = () => {
        provider.server = websocket.url;
    }

    vscode.workspace.onDidChangeTextDocument((e: vscode.TextDocumentChangeEvent) => {
		if (e.document === vscode.window.activeTextEditor.document) {
            let editor = vscode.window.activeTextEditor;
            let text = editor.document.getText();
            websocket.send(text);
		}
    });
    
    vscode.window.onDidChangeActiveTextEditor((e: vscode.TextEditor) => {
        if (e.document.languageId == 'javascript') {
            statusBarItem.show();
        } else {
            statusBarItem.hide();
        }
    });

    let disposable = vscode.commands.registerCommand('extension.showCanvas', () => {
        vscode.commands.executeCommand('vscode.previewHtml', previewUri, vscode.ViewColumn.Two, 'p5js Canvas').then((success) => {
            outputChannel.show(true);
        }, (reason) => {
            vscode.window.showErrorMessage(reason);
        });
    });

    context.subscriptions.push(disposable, statusBarItem);
}

export function deactivate() {
}