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

var leaderBoardController = function () {

};


var adminController = function ($scope, $http) {

  var refreshData = function () {
    $http.get("/api/game/all").success(function (games) {
      $scope.games = games;
    });
    $scope.newGameName = "";
  };

  var init = function () {
    $scope.games = [];
    refreshData();
  };

  $scope.start = function (game) {
    var body = {gameCode: game.gameCode, status: "PLAYING"};
    $http.post("/api/game/updateStatus", body).success(function () {
      refreshData();
    })
  };

  $scope.delete = function (game) {
    var body = {gameCode: game.gameCode};
    $http.post("/api/game/delete", body).success(function () {
      refreshData();
    })
  };

  $scope.createGame = function() {
    var body = {gameName: $scope.newGameName};
    $http.post("/api/game/create", body).success(function() {
      refreshData();
      $scope.newGameName = "";
    });
  };

  $scope.disableCreateButton = function() {
    return $scope.newGameName.length < 2 ||
      _.filter($scope.games, function(game) { return game.gameName === $scope.newGameName;}).length > 0;
  };

  init();

};
