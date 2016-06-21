"use strict";

module.exports =  function doBarking (req, res) {
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
}
