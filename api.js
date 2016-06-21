"use strict";

const http = require("http");
const Router = require("./router");

const server = http.createServer();

server.on("request", onRequest)

function onRequest (request, response) {
    if (request.url === "/api/not-found")
        response.statusCode = 404;
    else
        response.statusCode = 200;

    response.end();
}

module.exports = server;
