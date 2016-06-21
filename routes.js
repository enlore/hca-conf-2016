"use strict";

module.exports = {
    doRoot: doRoot,
    doHello: doHello,
    getEcho: getEcho,
    postEcho: postEcho
}

function doRoot (req, res) {
    res.end();
}

function doHello (req, res) {
    let name = req.query.name || "bob";
    res.end(`Hi ${name}`);
}

function getEcho (req, res) {
    let accept = req.headers.accept || "text/plain";
    let response = "";

    if (/json/.test(accept)) {
        res.setHeader("Content-Type", "application/json");
        response = JSON.stringify({
            route: req.pathname,
            message: "Here's some JSON"
        })

    } else if (/xml/.test(accept)) {
        res.setHeader("Content-Type", "text/xml");
        response = `<node id="message">Here's some XML</node>`
            + `<node id="route">${req.pathname}</node>`;

    } else {
        res.setHeader("Content-Type", "text/plain");
        response = "Hey it's just some plain text";
    }

    res.end(response);
}

function postEcho (req, res) {
    let accept = req.headers.accept || "text/plain";
    let response = "";

    if (/json/.test(accept)) {
        res.setHeader("Content-Type", "application/json");
        response = JSON.stringify({
            route: req.pathname,
            message: "Here's some JSON"
        })

    } else if (/xml/.test(accept)) {
        res.setHeader("Content-Type", "text/xml");
        response = `<node id="message">Here's some XML</node>`
            + `<node id="route">${req.pathname}</node>`;

    } else {
        res.setHeader("Content-Type", "text/plain");
        response = "Hey it's just some plain text";
    }

    res.end(response);
}
