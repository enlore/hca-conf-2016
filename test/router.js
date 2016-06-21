"use strict";
require("should");

const sinon = require("sinon");
const Router = require("../router");
const r = new Router();

describe("Router", function () {
    //it("fires correct callback on matched route string", doRoute);
});

function doRoute (done) {
    let cb = sinon.spy(function () {
        cb.calledOnce.should.be.true();
        done();
    });

    r.setHandler("route-string", cb);

    r.handle("route-string");
}
