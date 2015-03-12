var homeController = function ($scope, $location) {
  $scope.gotoJoin = function () {
    $location.path('/join');
  };

  $scope.gotoJoinWatch = function () {
    $location.path('/joinWatch');
  };

  $scope.gotoLeaderBoard = function () {
    $location.path('/chooseGame');
  };
};

var loginController = function ($scope, $location, $http, $timeout) {

  $scope.showPrompt = false;
  $scope.showJoin = true;
  $scope.gameCode = "";
  $scope.teamName = "";

  $scope.init = function () {
    $http.get('/api/participant').success(function (participantInfo) {
      if (participantInfo && participantInfo.gameCode) {
        $http.get("/api/game/gameStatus?gameCode=" + participantInfo.gameCode).success(function (gameInfo) {
          if (gameInfo.status !== 'NOT_VALID' && gameInfo.status !== 'GAME_ENDED') {
            $scope.gameCode = participantInfo.gameCode;
            $scope.showPrompt = true;
            $scope.showJoin = false;
          }
        });
      }
    });
  };

  $scope.joinNewGame = function () {
    $http.get('/api/game/gameStatus?gameCode=' + $scope.gameCode).success(function (data, status) {
      if (status === 200 && data.gameCode) {
        var body = {
          gameCode: data.gameCode,
          teamName: $scope.teamName,
          players: $scope.players

        };
        $http.post("/api/game/join", body).success(function () {
          $location.path("/play").search({gameCode: data.gameCode});
        });
      } else {
        showError();
      }
    }, function (err) {
      showError();
    });
  };

  $scope.joinExistingGame = function() {
    $location.path("/play").search({gameCode: $scope.gameCode});
  };

  $scope.joinAnotherGame = function() {
    $scope.showPrompt = false;
    $scope.showJoin = true;
    $scope.gameCode = "";
  };

  $scope.cancel = function () {
    $location.path('/');
  };

  $scope.watch = function () {
    $location.path('/play').search({gameCode: $scope.gameCode, watch: "true"});
  };

  var showError = function () {
    $scope.errorMessage = "Unable to join game.";
    $scope.showError = true;
    $timeout(function () {
      $scope.showError = false;
    }, 5000);
  };

  $scope.init();
};


var chooseGameController = function ($scope, $location, $http, $timeout) {
  $scope.gameCode = "";
  $scope.showError = false;
  $scope.cancel = function () {
    $location.path('/');
  };

  $scope.displayError = function () {
    $scope.errorMessage = "Unable to find game.";
    $scope.showError = true;
    $timeout(function () {
      $scope.showError = false;
    }, 5000);
  };

  $scope.join = function () {
    $http.get('/api/game/gameStatus?gameCode=' + $scope.gameCode).success(function (data, status) {
      if (status === 200 && data.status) {
        $location.path("/leaderboard").search({gameCode: $scope.gameCode});
      } else {
        $scope.displayError();
      }
    });
  };
};

var createTeamController = function ($scope, $location, $http) {
  // create ten empty strings for the player names.
  $scope.players = new Array(10).join(".").split(".");

  $scope.addAnotherPlayer = function () {
    $scope.players.push("");
  };

  $scope.cancel = function () {
    $location.path("/");
  };

  $scope.joinGame = function () {
    var body = {
      gameCode: $location.search().gameCode,
      teamName: $scope.teamName,
      players: $scope.players

    };
    $http.post("/api/game/join", body).success(function () {
      $location.path("/play");
    });

  };
};

var leaderBoardController = function ($scope, $http, $timeout, $location) {

  var sortScores = function (scores) {
    return _.sortBy(scores, 'totalScore').reverse();
  };

  var updateScores = function () {
    $http.get("/api/game/" + $scope.gameCode + "/scores").success(function (scores) {
      $scope.scores = sortScores(scores);
    });
    $timeout(updateScores, 5000);
  };

  var init = function () {
    $scope.gameCode = $location.search().gameCode;
    $scope.scores = [];
    updateScores();
  };

  $scope.getOrdinal = function (n) {
    var s = ["th", "st", "nd", "rd"],
      v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  init();
};


var adminController = function ($scope, $http) {

  $scope.refreshData = function () {
    $http.get("/api/game/all").success(function (games) {
      $scope.games = games;
    });
    $scope.newGameName = "";
  };

  var init = function () {
    $scope.games = [];
    $scope.refreshData();
    $http.get("/api/question/groups").success(function(groups) {
      $scope.groups = groups;
      $scope.selectedGroup = $scope.groups[0];
      $scope.updateQuestionSize();
    });
  };

  $scope.start = function (game) {
    var body = {gameCode: game.gameCode, status: "PLAYING"};
    $http.post("/api/game/updateStatus", body).success(function () {
      $scope.refreshData();
    })
  };

  $scope.deleteGame = function (game) {
    var body = {gameCode: game.gameCode};
    $http.post("/api/game/delete", body).success(function () {
      $scope.refreshData();
    })
  };

  $scope.createGame = function () {
    var body = {gameName: $scope.newGameName,
                group: $scope.selectedGroup,
                numberOfQuestions: $scope.numberOfQuestions};
    $http.post("/api/game/create", body).success(function () {
      $scope.refreshData();
      $scope.newGameName = "";
      $scope.selectedGroup = $scope.groups[0];
    });
  };

  $scope.updateQuestionSize = function() {
    $http.get("/api/question/group/" + $scope.selectedGroup + "/size").success(function (size) {
      $scope.numberOfQuestions = size.size;
    });
  };

  $scope.disableCreateButton = function () {
    return $scope.newGameName.length < 2 ||
      _.filter($scope.games, function (game) {
        return game.gameName === $scope.newGameName;
      }).length > 0;
  };

  init();

};

var questionController = function($scope, $upload, $http) {
    $scope.$watch('files', function () {
        $scope.upload($scope.files);
    });

    $scope.upload = function (files) {
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                $upload.upload({
                    url: 'api/question/bulk',
                    fields: {'username': $scope.username},
                    file: file
                }).progress(function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                }).success(function (data, status, headers, config) {
                    console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
                    if(status == 200) {
                        $scope.questions = _.map(data, function(question) {
                          question.serverErrors = "";
                          return question;
                        });
                    }
                });
            }
        }
    };

    $scope.questions = [];
    $scope.addNewQuestion = function() {
        $scope.questions.push({
            category: "",
            question: "",
            answers: ["", "", "", ""],
            correctAnswer: -1,
            answerText:  "",
            serverErrors: ""
        });
    };

    $scope.removeQuestion = function(questionIndex) {
        if($scope.questions.length === 1) {
            $scope.questions = [];
        } else {
            $scope.questions = $scope.questions.splice(questionIndex);
        }
    };

    $scope.publishQuestions = function() {
        console.log(JSON.stringify($scope.questions));
      _.map($scope.questions, function(question) {
        if(question.status === 'added') {
          return;
        }
        $http.post('/api/question/new', question).success(function(status) {
          question.status = 'added';
          question.serverErrors = '';
        }).error(function(data, status) {
          if(status == 400) {
            question.serverErrors = data.status;
          }
        })
      })
    };

    var isInvalidText = function(text) {
        return text == null || text.length == 0;
    };

    $scope.hasValidationError = function(question) {
        return isInvalidText(question.category) ||
            isInvalidText(question.question) ||
            isInvalidText(question.answers[0]) ||
            isInvalidText(question.answers[1]) ||
            isInvalidText(question.answers[2]) ||
            isInvalidText(question.answers[3]) ||
            question.correctAnswer < 0 || question.correctAnswer > 3 ||
            question.serverErrors.length > 0;
    };

    $scope.getValidationErrors = function(question) {
        var errors = "";
        if(isInvalidText(question.category)) {
            errors += "Category is invalid. ";
        }
        if(isInvalidText(question.question)) {
            errors += "Question is invalid. ";
        }
        if(isInvalidText(question.answers[0])) {
            errors += "The first question is invalid. ";
        }
        if(isInvalidText(question.answers[1])) {
            errors += "The second question is invalid. ";
        }
        if(isInvalidText(question.answers[2])) {
            errors += "The third question is invalid. ";
        }
        if(isInvalidText(question.answers[3])) {
            errors += "The fourth question is invalid. ";
        }
        if(question.correctAnswer < 0 || question.correctAnswer > 3) {
            errors += "The correct answer has not been selected."
        }
        return errors + question.serverErrors;
    };

    $scope.hasTextInputError = function(text) {
        return text == null || text.length == 0;
    }
};
