'use strict';

import * as vscode from 'vscode';
import * as WebSocket from 'ws';

export class WebSocketServer {

    private socket: WebSocket.Server;
    private channel: vscode.OutputChannel;
    private websocket: WebSocket;

    public url: string = "";
    public onListening: () => void = () => {};

    constructor(outputChannel: vscode.OutputChannel) {
        this.channel = outputChannel;
        this.socket = new WebSocket.Server({ port: 0 });

        this.socket.on('listening', () => {
            let {port} = this.socket._server.address();
            this.url = `ws://127.0.0.1:${port}`;
            this.onListening();

            // Listening for open connection
            this.socket.on('connection', (websocket) => {
                this.websocket = websocket;

                // Listening for incomming messages
                this.websocket.on('message', (data) => {
                    this.channel.appendLine(data);
                });
            });

        });
    }

    public send(code: string) {
        if (this.websocket != undefined) {
            this.websocket.send(code);
        }
    }

}