"use strict";
const should = require("should");

const api = require("./api");

describe("api speaks http", function () {
    it("responds to GET /", doGet);
    it("responds to GET /api/hello with name", doHello);
    it("responds to GET /api/hello with name passed as query param", doHelloJenny);
    it("responds to GET /api/not-found with 404", doNotFound);
    it("responds to GET /api/echo with JSON via Accept header", doJSON);
    it("responds to GET /api/echo with XML via Accept header", doXML);
    it("responds to POST /api/barks with JSON, data from POST body", doPostJSON);
    it("responds to POST /api/echo with XML, data from POST body");
    it("responds to POST without JSON with 400", do400onPOST);
    it("responds to /api/auth with 401 for bad credentials", do401);
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
    .expect(function onJSON (res) {
        res.text.should.be.a.String();
        res.body.route.should.eql("/api/echo");
        res.body.message.should.eql("Here's some JSON");
    })
    .end(done);
}

function doXML (done) {
    api.get("/api/echo")
    .set("Accept", "text/xml")
    .expect(200)
    .expect("Content-Type", /xml/)
    .expect(function onXML (res) {
        res.text.should.match(/id="message"/);
        res.text.should.match(/id="route"/);
    })
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

function doPostJSON (done) {
    api.post("/api/barks")
    .set("Accept", "application/json")
    .set("Content-Type", "application/json")
    .send({count: 3, noise: "BARK", sep: " "})
    .expect(200)
    .expect(function onPostJSON (res) {
        should.exists(res.body.result, "Expected a response body")
        res.body.result.should.eql("BARK BARK BARK")
    })
    .end(done);
}

function do400onPOST (done) {
    api.post("/api/barks")
    .set("Accept", "application/json")
    .set("Content-Type", "text/xml")
    .send(`<node id="noise">quack</node>`)
    .expect(400)
    .expect(function (res) {
        res.res.statusMessage.should.match(/only accepts JSON/);
    })
    .end(done)
}

function do401 (done) {
    api.get("/api/auth")
    .auth("nobody", "not a password")
    .expect(401)
    .end(done);
}
