"use strict";
const should = require("should");

const api = require("./api");

describe("Geocoding API", function () {
    it("responds to JSON POST to /api/geocode with JSON", doJSON);
    it("responds to JSON POST to /api/geocode with XML");
})

function doJSON (done) {
    api.post("/api/geocode")
    .set("accept", "application/json")
    .set("content-type", "application/json")
    .send({
        address: "1015 W Kirkland Ave, STE 402, Nashville, TN 37216"
    })
    .expect(200)
    .expect(function (res) {
        should.exists(res.body.results, "no results")
        res.body.results.should.be.an.Array();
        should.exists(res.body.results[0].address, "no address on 0");
        should.exists(res.body.results[0].location, "no location on 0");
    })
    .end(done);
}

function doXML (done) {

}
