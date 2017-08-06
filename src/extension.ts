'use strict';

import * as vscode from 'vscode';
import { TextDocumentContentProvider } from './TextDocumentContentProvider';
import { WebSocketServer } from './WebSocketServer';

export function activate(context: vscode.ExtensionContext) {
    
    let previewUri = vscode.Uri.parse('p5canvas://authority/p5canvas');

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

	vscode.window.onDidChangeTextEditorSelection((e: vscode.TextEditorSelectionChangeEvent) => {
		if (e.textEditor === vscode.window.activeTextEditor) {
            let editor = vscode.window.activeTextEditor;
            let text = editor.document.getText();
            websocket.send(text);
		}
    });
    
    let disposable = vscode.commands.registerCommand('extension.showCanvas', () => {
        vscode.commands.executeCommand('vscode.previewHtml', previewUri, vscode.ViewColumn.Two, 'p5js Canvas').then((success) => {
            outputChannel.show(true);
        }, (reason) => {
            vscode.window.showErrorMessage(reason);
        });
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {
}