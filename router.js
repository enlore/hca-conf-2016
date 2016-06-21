"use strict";

class Router {
    constructor () {
        this.routes = {};
    }

    setHandler (route, cb) {
        this.routes[route] = cb;
    }

    handle (route) {
        this.routes[route]();
    }
}

module.exports = Router;
