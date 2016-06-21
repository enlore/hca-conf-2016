"use strict";

const http = require("http");
const Router = require("./router");
const router = new Router();
const middleware = require("./middleware");
const routes = require("./routes");
const barking = require("./barking");

router.use(middleware.setFirst);
router.use(middleware.setSecond);
router.use(middleware.setBanana);

router.setHandler("/", routes.doRoot);
router.setHandler("/api/hello", routes.doHello);
router.setHandler("GET", "/api/echo", routes.getEcho);
router.setHandler("POST", "/api/echo", routes.postEcho);

router.setHandler("POST", "/api/barks", barking);

const server = http.createServer();

server.on("request", function onReq (req, res) {
    router.handle(req, res);
})

server.on("error", function (err) {
    throw err;
})

module.exports = server;
