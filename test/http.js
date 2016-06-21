const api = require("./api");

describe("api speaks http", function () {
    it("responds to GET /", doGet);
})

function doGet (done) {
    api.get("/")
    .expect(200, done)
}
