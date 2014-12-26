describe('Arrays', function () {
    describe('length', function () {

        it('should default to zero', function () {
            expect([].length).to.equal(0);
        });

        it('should be one with one item in it', function () {
            expect([1].length).to.equal(1);
        });
    });
});