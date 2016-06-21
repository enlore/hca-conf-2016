"use strict";

const http = require("http");
const Router = require("./router");
const router = new Router();

router.use(function setFirst (req, res, next) {
    res.setHeader("x-first", Date.now());
    next();
})

router.use(function setSecond (req, res, next) {
    setTimeout(() => {
        res.setHeader("x-second", Date.now());
        next();
    }, 200);
})

router.use(function setBanana (req, res, next) {
    res.setHeader("x-bananas", "this is");
    next();
})

router.setHandler("/", function doRoot (req, res) {
    res.end();
});

router.setHandler("/api/hello", function doHello (req, res) {
    let name = req.query.name || "bob";
    res.end(`Hi ${name}`);
})

router.setHandler("GET", "/api/echo", function doEcho (req, res) {
    let accept = req.headers.accept || "text/plain";
    let response = "";

    if (/json/.test(accept)) {
        res.setHeader("Content-Type", "application/json");
        response = JSON.stringify({
            route: req.pathname,
            message: "Here's some JSON"
        })

    } else if (/xml/.test(accept)) {
        res.setHeader("Content-Type", "text/xml");
        response = `<node id="message">Here's some XML</node>`
            + `<node id="route">${req.pathname}</node>`;

    } else {
        res.setHeader("Content-Type", "text/plain");
        response = "Hey it's just some plain text";
    }

    res.end(response);
})

router.setHandler("POST", "/api/echo", function doEcho (req, res) {
    let accept = req.headers.accept || "text/plain";
    let response = "";

    if (/json/.test(accept)) {
        res.setHeader("Content-Type", "application/json");
        response = JSON.stringify({
            route: req.pathname,
            message: "Here's some JSON"
        })

    } else if (/xml/.test(accept)) {
        res.setHeader("Content-Type", "text/xml");
        response = `<node id="message">Here's some XML</node>`
            + `<node id="route">${req.pathname}</node>`;

    } else {
        res.setHeader("Content-Type", "text/plain");
        response = "Hey it's just some plain text";
    }

    res.end(response);
});

const server = http.createServer();

server.on("request", function onReq (req, res) {
    router.handle(req, res);
})

server.on("error", function (err) {
    throw err;
})

module.exports = server;
