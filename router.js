"use strict";

const url = require("url");

class Router {
    constructor () {
        this.routes = {
            GET: {},
            POST: {},
            PUT: {},
            DELETE: {}
        };
        this.middlewares = [];
    }

    setHandler (method, route, cb) {
        if (typeof route === "function") {
            cb = route;
            route = method;
            method = "GET";
        }

        this.routes[method][route] = cb;
    }

    handle (req, res) {
        let urlInfo = url.parse(req.url, true);
        let pathname = urlInfo.pathname;
        let method = req.method;

        let route = this.routes[method][pathname];

        // pass along query params
        req.query = urlInfo.query;
        req.pathname = pathname;

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
