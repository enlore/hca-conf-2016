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

        this.routes[urlInfo.pathname](req, res);
    }
}

module.exports = Router;
