"use strict";

const Geocoder = require("../geocode-it/geocoder");

const apiKey = "AIzaSyBiHVp5_5Mq39JzViGie2P5gn2GunXmbHI";

const geocoder = new Geocoder({
    apiKey: apiKey
});

module.exports = function doDeo (req, res) {
    let address = req.body.address;
    let response;

    res.setHeader("content-type", "application/json");

    if (!address || address === "") {
        res.writeHead(400, "Must pass an address");
        return res.end()
    }

    geocoder.geocode(address, onGeo)

    function onGeo (err, geos) {
        if (err) {
            response = JSON.stringify({err: err, stack: err.stack});
            res.writeHead(500, "API Error");
            return res.end();
        }

        response = JSON.stringify({
            results: geos
        })

        res.end(response);
    }
}
