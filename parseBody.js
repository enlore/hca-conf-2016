"use strict";

module.exports = function parseBody (req, res, next) {
    let buf = "";

    if (req.method !== "POST" && req.method !== "PUT") {
        return next();

    } else {
        req.setEncoding("utf8");

        req.on("data", onData)
        req.on("end", onEnd)
    }

    function onData (data) {
        buf += data;
    }

    function onEnd () {
        if (/json/.test(req.headers["content-type"])) {
            req.body = JSON.parse(buf);
            next();

        } else {
            res.writeHead(400, "This endpoint only accepts JSON POST bodies")
            return res.end();
        }
    }
}
