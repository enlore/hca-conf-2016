"use strict";

const http = require("http");
const Router = require("./router");

const server = http.createServer();

server.on("request", onRequest)

function onRequest (request, response) {
    response.statusCode = 200;
    response.end();
}

module.exports = server;
