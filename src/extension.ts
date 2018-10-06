'use strict';

import * as vscode from 'vscode';
import { TextDocumentContentProvider } from './TextDocumentContentProvider';
import { WebSocketServer } from './WebSocketServer';
import { JSHINT } from 'jshint';

var websocket: WebSocketServer;

export function activate(context: vscode.ExtensionContext) {
    
    let previewUri = vscode.Uri.parse('p5canvas://authority/p5canvas');

    let statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    statusBarItem.text = `$(file-media) p5canvas`;
    statusBarItem.command = 'extension.showCanvas';
    statusBarItem.show();

    let provider = new TextDocumentContentProvider();
    let registration = vscode.workspace.registerTextDocumentContentProvider('p5canvas', provider);

    let outputChannel = vscode.window.createOutputChannel('p5canvas console');
    websocket = new WebSocketServer(outputChannel);
    websocket.onListening = () => {
        provider.server = websocket.url;
    }

    let lastKnownEditor = vscode.window.activeTextEditor;

    websocket.onConnection = () => {
        outputChannel.show(true);
        if (lastKnownEditor && lastKnownEditor.document) {
            updateCode(lastKnownEditor, websocket, outputChannel);
        }
    }

    vscode.workspace.onDidChangeTextDocument((e: vscode.TextDocumentChangeEvent) => {
		if (e && e.document === vscode.window.activeTextEditor.document && e.document.languageId == 'javascript') {
            let editor = vscode.window.activeTextEditor;
            if (editor) {
                lastKnownEditor = editor;
                updateCode(lastKnownEditor, websocket, outputChannel);
            }
		}
    });
    
    vscode.window.onDidChangeActiveTextEditor((e: vscode.TextEditor) => {
        if (e && e.document.languageId == 'javascript') {
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

    let disposable = vscode.commands.registerCommand('extension.showCanvas', () => {
        vscode.commands.executeCommand('vscode.previewHtml', previewUri, vscode.ViewColumn.Two, 'p5canvas').then((success) => {
            
        }, (reason) => {
            vscode.window.showErrorMessage(reason);
        });
    });

    let disposableSaveAsPNG = vscode.commands.registerCommand('extension.saveAsPNG', () => {
        
    });

    context.subscriptions.push(disposable, statusBarItem, disposableSaveAsPNG);
}

function updateCode(editor, websocket, outputChannel) {
    if (!editor) {
        console.log('Error: No document found');
        return;
    }
    let text = editor.document.getText();
    JSHINT(text);

    if (JSHINT.errors.length == 0) {
        outputChannel.clear();
        websocket.sendCode(text);
    } else {
        let message = "🙊 Errors:\n";
        JSHINT.errors.forEach(element => {
            message += `Line ${element.line}, col ${element.character}: ${element.reason}\n`;
        });
        outputChannel.clear();
        outputChannel.append(message);
    }
}

export function deactivate() {
    websocket.dispose();
}