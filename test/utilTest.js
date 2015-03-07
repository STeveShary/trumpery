var chai = require("chai");
var util = require("../app/util");
var expect = chai.expect;


describe('util', function () {

    describe('buildGameCode', function () {

        it("should generate a five digit numeric random number", function () {
            expect(util.buildGameCode().match('\\d+')).not.to.equal(null);
        });
    });
});