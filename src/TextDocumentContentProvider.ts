'use strict';

import * as vscode from 'vscode';
import * as fs from 'fs';

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
        return this.extractSnippet();
    }

    private extractSnippet(): string {
        let path = vscode.extensions.getExtension("garrit.p5canvas").extensionPath;

        let elements = [];

        let htmlhead = fs.readFileSync(path + '/assets/html_head.html', 'UTF-8');
        elements.push(htmlhead);
        let htmlbody = fs.readFileSync(path + '/assets/html_body.html', 'UTF-8');
        
        let p5lib: string = '<script src="' + path + '/assets/p5.min.js"></script>';
        elements.push(p5lib);
        let p5sound: string = '<script src="' + path + '/p5.sound.min.js"></script>';
        elements.push(p5sound);
        let jquery: string = '<script src="' + path + '/assets/jquery-3.2.1.min.js"></script>';
        elements.push(jquery);
        let websocketSetup: string = '<script src="' + path + '/assets/websocketlog.js"></script><script>setupWebsocket("' + this.server + '");</script>';
        elements.push(websocketSetup);
        let p5resize: string = '<script src="' + path + '/assets/p5setup.js"></script>';
        elements.push(p5resize);
        let errorHandler: string = '<script src="' + path + '/assets/errorHandler.js"></script>';
        elements.push(errorHandler);
        let js = '<script id="code">' + '</script>';
        elements.push(js);
        elements.push(htmlbody);

        return elements.join('');
    }

    private errorHtml(error: string): string {
        return `
            <body>
                ${error}
            </body>`;
    }
}