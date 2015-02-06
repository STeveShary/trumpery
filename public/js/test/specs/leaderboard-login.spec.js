describe('Controllers', function () {
    describe('LeaderBoard Login', function () {

        var $scope = {};
        var $location = {};
        var $http = {};
        var $timeout = {};

        beforeEach(function () {
            $scope = {};
            $location = {};
            $http = {};
            $timeout = sinon.stub() ;
        });

        it('should go back to the home screen on cancel.', function () {
            $location.path = sinon.stub();
            chooseGameController($scope, $location, $http, $timeout);
            $scope.cancel();
            expect($location.path).to.have.been.calledWith("/");
        });

        it('should check that the game is valid before moving to the leaderboard.', function () {
            $http.get = sinon.stub().returns({success: function (callback) {
                callback.apply(this,  [{status: "ok"}, 200]);
            }});
            var gameCode = "1234";
            var locationSearch = sinon.stub();
            $location.path = sinon.stub().returns({search: locationSearch});
            chooseGameController($scope, $location, $http, $timeout);
            $scope.gameCode = gameCode;
            $scope.join();
            expect($scope.showError).to.be.false;
            expect($location.path).to.have.been.calledWith("/leaderboard");
            expect(locationSearch).to.have.been.calledWith({gameCode: gameCode});

        });

        it('should show an error if the game has a bad status return code.', function () {
            $http.get = sinon.stub().returns({success: function (callback) {
                callback.apply(this,  [{}, 500]);
            }});
            chooseGameController($scope, $location, $http, $timeout);
            $scope.gameCode = "1234";
            $scope.join();
            expect($scope.showError).to.be.true;
            expect($scope.errorMessage).to.equal("Unable to find game.");
            expect($timeout).to.have.been.calledOnce;
        });
    });
});
