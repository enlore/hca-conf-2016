const api = require("./api");

describe("api speaks http", function () {
    it("responds to GET /", doGet);
    it("responds to GET /api/hello", doHello);
})

function doGet (done) {
    api.get("/")
    .expect(200, done)
}

function doHello (done) {
    api.get("/api/hello")
    .expect(200, done);
}
