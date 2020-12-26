"use strict";

import express from 'express';
import http from 'http';
import WebSocket from 'ws';

const app = express();

// initialize a simple http server
const server = http.createServer(app);

// initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

app.use('/', express.static('./'));

app.get('/demo', function (req, res) {
  res.send('hello world');
});

wss.on('connection', (ws) => {
    console.log('WS Client is connecting...');

    // connection is up, let's add simple event handlers

    ws.on('message', function(message) {
        console.log('WS recv message:', message);
    });

    ws.on('error', (err) => {
        console.warn(`WS Client error - reason: ${err}`);
        console.warn('  Does this mean that it is also disconnected???');
    })

    ws.on('close', (err) => {
        console.warn('WS Client is disconnecting...');
    })
});

// start our server
server.listen(process.env.PORT || 8080, () => {
    console.log(`Server started on port ${server.address().port} :)`);
});
