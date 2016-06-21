"use strict";

const api = require("./api");

describe("api speaks http", function () {
    it("responds to GET /", doGet);
    it("responds to GET /api/hello with name", doHello);
    it("responds to GET /api/hello with name passed as query param", doHelloJenny);
    it("responds to GET /api/not-found with 404", doNotFound);
    it("responds to POST /api/echo with JSON via Accept header", doJSON);
    it("responds to POST /api/echo with XML via Accept header", doXML);
})

describe("api shows evidence of middleware", function () {
    it("exhibits custom header on all requests", doCustomHeader);
    it("processes middleware in order, shown via middleware with timestamps", doOrder)
})

function doGet (done) {
    api.get("/")
    .expect(200, done)
}

function doHello (done) {
    api.get("/api/hello?name=bob")
    .expect(200)
    .expect(function (res) {
        res.text.should.equal("Hi bob");
    })
    .end(done);
}

function doHelloJenny (done) {
    api.get("/api/hello?name=jenny")
    .expect(200)
    .expect(function (res) {
        res.text.should.be.eql("Hi jenny");
    })
    .end(done)
}

function doNotFound (done) {
    api.get("/api/not-found")
    .expect(404, done);
}

function doJSON (done) {
    api.get("/api/echo")
    .set("Accept", "application/json")
    .expect(200)
    .expect("Content-Type", /json/)
    .end(done);
}

function doXML (done) {
    api.get("/api/echo")
    .set("Accept", "text/xml")
    .expect(200)
    .expect("Content-Type", /xml/)
    .end(done);
}

function doCustomHeader (done) {
    let cbCount = 0;
    let cbLimit = 3;

    api.get("/api/echo")
    .expect(200)
    .expect("x-bananas", "this is")
    .end(onEnd);

    api.get("/")
    .expect(200)
    .expect("x-bananas", "this is")
    .end(onEnd);

    api.get("/api/hello")
    .expect(200)
    .expect("x-bananas", "this is")
    .end(onEnd);

    function onEnd (err) {
        cbCount++;

        if (err)
            done(err);

        else if (cbCount === cbLimit)
            done();
    }
}

function doOrder (done) {
    api.get("/api/echo")
    .expect(200)
    .expect(res => {
        res.headers["x-first"].should.not.be.undefined();
        res.headers["x-second"].should.not.be.undefined();
        let first = parseInt(res.headers["x-first"]);
        let second = parseInt(res.headers["x-second"]);

        first.should.be.lessThan(second);
    })
    .end(done)
}
