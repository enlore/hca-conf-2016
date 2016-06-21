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

        if (route === void 0) {
            res.writeHead(404);
            return res.end();

        } else if (this.middlewares.length > 0) {
            let mws = this.middlewares;

            let _i = 0;

            mws[_i](req, res, next);

            // this is tricky. we have to allow for async middleware, but the
            // middleware must also process in order
            function next () {
                if (++_i < mws.length)
                    mws[_i](req, res, next);
                else
                    return final(req, res);
            }

            function final (req, res) {
                route(req, res);
            }

        } else {
            return route(req, res);

        }
    }

    use (cb) {
        this.middlewares.push(cb);
    }
}

module.exports = Router;
