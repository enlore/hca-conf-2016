"use strict";

const http = require("http");
const Router = require("./router");
const router = new Router();

router.setHandler("/", function doRoot (req, res) {
    res.end();
});

router.setHandler("/api/hello", function doHello (req, res) {
    let name = req.query.name || "bob";
    res.end(`Hi ${name}`);
})

router.setHandler("/api/echo", function doEcho (req, res) {
    let accept = req.headers.accept || "text/plain";

    if (/json/.test(accept))
        res.setHeader("Content-Type", "application/json");

    else if (/xml/.test(accept))
        res.setHeader("Content-Type", "text/xml");

    else
        res.setHeader("Content-Type", "text/plain");

    res.end();
})

const server = http.createServer();

server.on("request", function onReq (req, res) {
    router.handle(req, res);
})

server.on("error", function (err) {
    throw err;
})

module.exports = server;
