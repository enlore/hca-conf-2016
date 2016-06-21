"use strict";

const http = require("http");
const Router = require("./router");
const router = new Router();
const middleware = require("./middleware");
const routes = require("./routes");
const barking = require("./barking");
const parseBody = require("./parseBody");

const doGeo = require("./geo")


router.use(middleware.setFirst);
router.use(middleware.setSecond);
router.use(middleware.setBanana);
router.use(doAuth);
router.use(parseBody);


router.setHandler("/", routes.doRoot);
router.setHandler("/api/hello", routes.doHello);
router.setHandler("GET", "/api/echo", routes.getEcho);
router.setHandler("POST", "/api/echo", routes.postEcho);

router.setHandler("POST", "/api/barks", barking);
router.setHandler("GET", "/api/auth",  doOk);

router.setHandler("POST", "/api/geocode", doGeo);

function doOk (req, res) {
    console.log("do we even get here?")
    res.statusCode = 200;
    res.end("Ok");
}

function doAuth (req, res, next) {
    let routes = [
        '/api/auth'
    ];

    // if it's on the list, it needs auth
    if (routes.indexOf(req.pathname) !== -1) {
        let authHeader = req.headers["authorization"];
        let authParts = authHeader.split(" ");
        let authType = authParts[0];
        let token = authParts[1];

        // are you on the list?
        let user = "user";
        let pass = "password";

        let test = new Buffer(`${user}:${pass}`).toString("base64");

        if (test === token) {
            // we're good!
            next();

        } else {
            // we're not good!
            res.writeHead(401, "Bad user/pass comobo");
            return res.end();
        }

    } else {
        next();
    }
}

const server = http.createServer();

server.on("request", function onReq (req, res) {
    router.handle(req, res);
})

server.on("error", function (err) {
    throw err;
})

server._router = router;

module.exports = server;
