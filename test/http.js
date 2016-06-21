const api = require("./api");

describe("api speaks http", function () {
    it("responds to GET /", doGet);
    it("responds to GET /api/hello with name", doHello);
    it("responds to GET /api/hello with name passed as query param", doHelloJenny);
    it("responds to GET /api/not-found with 404", doNotFound);
    it("responds to POST /api/echo with JSON via Accept header", doJSON);
    it("responds to POST /api/echo with XML via Accept header", doXML);
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
