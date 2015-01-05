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

var loginController = function ($scope, $location, $http, $timeout) {
    $scope.gameCode = "";
    $scope.cancel = function () {
        $location.path('/');
    };

    $scope.watch = function() {
        $location.path('/watch');
    };

    var showError = function() {
        $scope.errorMessage = "Unable to join game.";
        $scope.showError = true;
        $timeout(function () {
            $scope.showError = false;
        }, 5000);
    };

    $scope.join = function() {
        $http.get('/api/game/isValid?gameCode=' + $scope.gameCode).success(function(data, status) {
            if(status === 200 && data.isValidGame) {
                $location.path("/createTeam").search({gameCode: $scope.gameCode});
            } else {
                showError();
            }
        }, function(err) {
            showError();
        });
    };
};

var createTeamController = function($scope, $location, $http) {
    // create ten empty strings for the player names.
    $scope.players = new Array(10).join(".").split(".");

    $scope.addAnotherPlayer = function() {
        $scope.players.push("");
    };

    $scope.cancel = function() {
        $location.path("/");
    };

    $scope.joinGame = function() {
        var body = {
            gameCode: $location.search().gameCode,
            teamName: $scope.teamName,
            players: $scope.players

        };
        $http.post("/api/game/join", body).success(function() {
            $location.path("/play");
        });

    };
};

var leaderBoardController = function() {

};
