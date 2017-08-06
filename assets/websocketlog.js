function setupWebsocket(server) {
    const socket = new WebSocket(server);

    socket.onerror = (error) => {
        console.log(error);
    };

    socket.onopen = (event) => {
        window.console.log = (msg) => {
            socket.send(msg);
        };

        socket.onmessage = (event) => {
            console.log("Message received..." + $('#code').val());
            console.log(event.data);
            $('#code').replaceWith("<script id=\"code\">" + event.data + "</script>");
        };
    };
};