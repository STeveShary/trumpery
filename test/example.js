var chai = require("chai");
var sinon = require("sinon");
sinon.assert.expose(chai.assert, { prefix: "" });
var expect = chai.expect;

describe('Array', function () {
    describe('#indexOf()', function () {
        it('should return -1 when the value is not present', function () {
            expect([1, 2, 3].indexOf(5)).to.equal(-1);
        });
    });
    describe('length', function () {
        it('should know the length of an empty array', function () {
            expect([].length).to.equal(0);
        });
    });
});
