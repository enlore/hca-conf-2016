"use strict";

const url = require("url");

class Router {
    constructor () {
        this.routes = {};
        this.middlewares = [];
    }

    setHandler (route, cb) {
        this.routes[route] = cb;
    }

    handle (req, res) {
        let urlInfo = url.parse(req.url, true);

        let route = this.routes[urlInfo.pathname];

        // pass along query params
        req.query = urlInfo.query;

        // if we have middlewares, use em
        if (this.middlewares.length > 0) {
            let mws = this.middlewares;

            let _i = 0;

            mws[_i](req, res, next);

            // this is tricky. we have to allow for async middleware, but the
            // middleware must also process in order
            function next () {
                _i++;

                if (mws[_i] !== void 0)
                    mws[_i](req, res, next);
            }
        }

        if (route !== void 0) {
            route(req, res);

        } else if (route === void 0) {
            res.writeHead(404);
            res.end();
        }
    }

    use (cb) {
        this.middlewares.push(cb);
    }
}

module.exports = Router;
