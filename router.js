"use strict";

const url = require("url");

class Router {
    constructor () {
        this.routes = {};
    }

    setHandler (route, cb) {
        this.routes[route] = cb;
    }

    handle (req, res) {
        let urlInfo = url.parse(req.url, true);

        let route = this.routes[urlInfo.pathname];

        // pass along query params
        req.query = urlInfo.query;

        if (route !== void 0) {
            route(req, res);

        } else if (route === void 0) {
            res.writeHead(404);
            res.end();
        }
    }
}

module.exports = Router;
