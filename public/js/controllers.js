var homeController = function ($scope, $location) {
    $scope.gotoJoin = function () {
        $location.path('/join');
    };

    $scope.gotoJoinWatch = function () {
        $location.path('/joinWatch');
    };

    $scope.gotoLeaderBoard = function() {
        $location.path('/leaderboard');
    };
};

var loginController = function ($scope, $location) {
    $scope.gameCode = "";
    $scope.cancel = function () {
        $location.path('/');
    };

    $scope.watch = function() {
        $location.path('/watch');
    };
};

var leaderBoardController = function() {

};
