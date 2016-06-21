"use strict";

const http = require("http");
const Router = require("./router");
const router = new Router();
const middleware = require("./middleware");

router.use(middleware.setFirst);

router.use(middleware.setSecond);

router.use(middleware.setBanana);

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

router.setHandler("POST", "/api/barks", function doBarking (req, res) {
    req.setEncoding("utf8");
    let buf = "";
    req.on("data", onData);
    req.on("end", onEnd);

    function onData (data) {
        buf += data;
    }

    function onEnd () {
        let body, response;

        let contentType = req.headers["content-type"];

        if (/json/.test(contentType)) {
            body = JSON.parse(buf);

        } else {
            res.writeHead(400, "This endpoint only accepts JSON POST bodies");
            return res.end();
        }

        let count = body.count || 1;
        let noise = body.noise.toUpperCase();
        let sep = body.sep || " ";

        if (noise === void 0) {
            res.writeHead(400, "Invalid request: 'noise' property required");
        }

        let msg = [];

        for (let _i = 0; _i < count; _i++) {
            msg.push(noise);
        }

        msg = msg.join(sep);

        let accept = req.headers["accept"];

        if (/json/.test(accept)) {
            res.setHeader("content-type", "application/json");

            response = JSON.stringify({
                result: msg
            });
        }

        res.end(response);
    }
})

const server = http.createServer();

server.on("request", function onReq (req, res) {
    router.handle(req, res);
})

server.on("error", function (err) {
    throw err;
})

module.exports = server;
