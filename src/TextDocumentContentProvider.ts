'use strict';

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

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
        return this.extractSnippet();
    }

    private extractSnippet(): string {
        let extensionPath = vscode.extensions.getExtension("garrit.p5canvas").extensionPath;
        let fileDesc = 'file://';
        if (os.platform() == 'win32') {
            fileDesc += 'localhost/';
        }
        if (!vscode.window.activeTextEditor) {
            return this.errorHtml("An error occured...");
        }
        // has to be changed everytime the window reloads
        let localPath = encodeURI(fileDesc + path.dirname(vscode.window.activeTextEditor.document.uri.fsPath) + path.sep);

        let elements = [];

        let htmlhead = fs.readFileSync(extensionPath + '/assets/html_head.html', 'UTF-8');
        elements.push(htmlhead);
        let htmlbody = fs.readFileSync(extensionPath + '/assets/html_body.html', 'UTF-8');
        
        let p5lib: string = '<script src="' + extensionPath + '/assets/p5.min.js"></script>';
        elements.push(p5lib);
        let p5sound: string = '<script src="' + extensionPath + '/assets/p5.sound.min.js"></script>';
        elements.push(p5sound);
        let jquery: string = '<script src="' + extensionPath + '/assets/jquery-3.2.1.min.js"></script>';
        elements.push(jquery);
        let websocketSetup: string = '<script src="' + extensionPath + '/assets/websocketlog.js"></script><script>setupWebsocket("' + this.server + '");</script>';
        elements.push(websocketSetup);
        let p5resize: string = '<script src="' + extensionPath + '/assets/p5setup.js"></script>';
        elements.push(p5resize);
        let errorHandler: string = '<script src="' + extensionPath + '/assets/errorHandler.js"></script>';
        elements.push(errorHandler);
        let localPathJs = '<script>window.localPath = "' + localPath + '";</script>';
        elements.push(localPathJs);
        let jsRulerFile: string = '<script src="' + extensionPath + '/assets/ruler.js"></script>';
        elements.push(jsRulerFile);
        let jsRuler = '<script>var p5rulersize = 20</script>'
        elements.push(jsRuler);
        let js = '<script id="code"></script>';
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