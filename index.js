import $ from "jquery";

var abcMain = function() {
    const l = window.location;
    const url = ((l.protocol === "https:") ? "wss://" : "ws://") + l.hostname + ":" + l.port + "/";

    window.sender = new Sender(url);
    window.app = new App();
    window.app.start();
};

$(document).ready(function() {
    abcMain();
});

class Sender {

    constructor(url) {
        this.url = url;
        this.open();
        this.connected = false;
    }

    open() {
        let c = new WebSocket(this.url);

        c.onopen = () => {
            this.connected = true;
        }

        c.onclose = () => {
            console.log(`WebSocket closed`);
            this.connected = false;
        }

        c.onerror = (error) => {
            console.log(`WebSocket error: ${error}`);
            this.connected = false;
        }

        c.onmessage = (e) => {
            console.log("WebSocket recv", e.data);
        }

        this.connection = c;
    }

    send(msg) {
        if (this.connected)
            this.connection.send(msg);
    }
}

class App {

    start() {
        $(".pad-button")
            .click(function(event) {
                window.app.onClick(this);
            })
            .mouseup(function() {
                $(this).removeClass("active");
            })
            .mousedown(function() {
                $(this).addClass("active");
            })
            .mouseleave(function() {
                $(this).removeClass("active");
            });
    }

    onClick(element) {
        let name = $(element).attr("id");
        window.sender.send("tap " + name);
    }
}
