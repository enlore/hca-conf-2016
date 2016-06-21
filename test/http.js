const api = require("./api");

describe("api speaks http", function () {
    it("responds to GET /", doGet);
    it("responds to GET /api/hello", doHello);
    it("responds to GET /api/not-found with 404", doNotFound);
})

function doGet (done) {
    api.get("/")
    .expect(200, done)
}

function doHello (done) {
    api.get("/api/hello?name=bob")
        .expect(function (res) {
            res.text.should.equal("Hi bob");
        })
    .expect(200, done);
}

function doNotFound (done) {
    api.get("/api/not-found")
    .expect(404, done);
}
