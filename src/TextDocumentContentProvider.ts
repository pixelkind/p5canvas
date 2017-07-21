'use strict';

import * as vscode from 'vscode';
import * as fs from 'fs';

export class TextDocumentContentProvider implements vscode.TextDocumentContentProvider {
    private _onDidChange = new vscode.EventEmitter<vscode.Uri>();

    public provideTextDocumentContent(uri: vscode.Uri): string {
        return this.createHtmlSnippet();
    }

    get onDidChange(): vscode.Event<vscode.Uri> {
        return this._onDidChange.event;
    }

    public update(uri: vscode.Uri) {
        this._onDidChange.fire(uri);
    }

    private createHtmlSnippet() {
        let editor = vscode.window.activeTextEditor;
        if (!(editor.document.languageId === 'javascript')) {
            return this.errorSnippet("Active editor doesn't show a JavaScript document.")
        }
        return this.extractSnippet();
    }

    private extractSnippet(): string {
        let editor = vscode.window.activeTextEditor;
        let text = editor.document.getText();
        let path = vscode.extensions.getExtension("garrit.p5canvas").extensionPath;
        // check if js is valid, otherwise show error
        // let begin: string = "<!DOCTYPE html><html><head><script src=\"https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.5.11/p5.min.js\"></script><script src=\"https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.5.11/addons/p5.sound.min.js\"></script>"
        
        let begin: string = "<!DOCTYPE html><html><head><script src=\"" + path + "/assets/p5.min.js\"></script><script src=\"https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.5.11/addons/p5.sound.min.js\"></script>"
        let js = "<script>" + text + "</script>";
        let end: string = "<link rel=\"stylesheet\" type=\"text/css\" href=\"style.css\"><style> body {padding: 0; margin: 0;} </style></head><body></body></html>"
        return begin + js + end;
    }

    private errorSnippet(error: string): string {
        return `
            <body>
                ${error}
            </body>`;
    }
}