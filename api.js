"use strict";

const http = require("http");
const Router = require("./router");
const router = new Router();

router.setHandler("/", function doRoot (req, res) {
    res.end();
});

router.setHandler("/api/hello", function doHello (req, res) {
    res.end("Hi bob");
})

const server = http.createServer();

server.on("request", function onReq (req, res) {
    router.handle(req, res);
})

server.on("error", function (err) {
    throw err;
})

module.exports = server;
