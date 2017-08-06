'use strict';

import * as vscode from 'vscode';

export class TextDocumentContentProvider implements vscode.TextDocumentContentProvider {
    
    private _onDidChange = new vscode.EventEmitter<vscode.Uri>();

    public server;

    public provideTextDocumentContent(uri: vscode.Uri): string {
        return this.createHtml();
    }

    get onDidChange(): vscode.Event<vscode.Uri> {
        return this._onDidChange.event;
    }

    public update(uri: vscode.Uri) {
        this._onDidChange.fire(uri);
    }

    private createHtml() {
        let editor = vscode.window.activeTextEditor;
        if (!(editor.document.languageId === 'javascript')) {
            return this.errorHtml("Active editor doesn't show a JavaScript document.")
        }
        return this.extractSnippet();
    }

    private extractSnippet(): string {
        let editor = vscode.window.activeTextEditor;
        let text = editor.document.getText();
        let path = vscode.extensions.getExtension("garrit.p5canvas").extensionPath;
        
        let begin: string = "<!DOCTYPE html><html><head><script src=\"" + path + "/assets/p5.min.js\"></script><script src=\"https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.5.11/addons/p5.sound.min.js\"></script>"
        let jquery: string = "<script src=\"" + path + "/assets/jquery-3.2.1.min.js\"></script>";
        let websocketSetup: string = "<script src=\"" + path + "/assets/websocketlog.js\"></script><script>setupWebsocket('" + this.server + "');</script>";
        let p5resize: string = "<script src=\"" + path + "/assets/p5setup.js\"></script>";
        let js = "<script id=\"code\">" + text + "</script>";
        let end: string = "<link rel=\"stylesheet\" type=\"text/css\" href=\"style.css\"><style> body {padding: 0; margin: 0;} </style></head><body></body></html>"
        return begin + jquery + websocketSetup + p5resize + js + end;
    }

    private errorHtml(error: string): string {
        return `
            <body>
                ${error}
            </body>`;
    }
}