var playGameController = function ($scope, $location, $http, $timeout, $interval, scoresService) {


  $scope.showError = function () {
    $scope.errorMessage = "Question not available";

    $scope.showError = true;
    $timeout(function () {
      $scope.showError = false;
    }, 5000);
  };


  $scope.submitAnswer = function (answerIndex) {
    if (answerIndex === $scope.teamGuess || !($scope.isUserPlaying())) {
      return;
    }
    var body = {gameCode: $scope.gameCode,
      answer: answerIndex};
    $scope.teamGuess = answerIndex;
    $scope.updateButtons();
    $http.post("/api/game/" + $scope.gameCode + "/submitAnswer", body).success(function (scoreResult) {
      $scope.score = scoreResult.score;
      $scope.answerSubmitted = true;
    });
  };

  $scope.calcPotentialPoints = function () {
    var percentagePointDeduction = (Date.now() - ($scope.questionStartTime + $scope.timeToReadQuestion)) / $scope.timeToAnswerQuestion;
    var pointsDeducted = Math.floor(1000 * percentagePointDeduction);
    if (pointsDeducted < 0) {
      pointsDeducted = 0;
    }
    return Math.floor(1000 - pointsDeducted);
  };

  $scope.updatePotentialPoints = function () {
    var potentialPoints = $scope.calcPotentialPoints();
    if (potentialPoints < 0) {
      potentialPoints = 0;
    }
    $scope.potentialPoints = potentialPoints;
    if (!$scope.answerSubmitted) {
      $scope.score = $scope.potentialPoints;
    }
    $scope.calculateProgressFromPoints();
  };

  $scope.startPointsTimer = function () {
    $timeout(function () {
      $scope.updatePotentialPoints();
      if ($scope.potentialPoints > 0) {
        $scope.startPointsTimer();
      } else {
        console.log("SHowing answer now!");
        $scope.showAnswer();
      }
    }, 50);
  };

  $scope.displayMessage = function (message) {
    $scope.message = message;
    $scope.showYourAnswer = false;
    $scope.showMessage = true;
    $scope.showQuestion = false;
  };


  $scope.setNotStarted = function () {
    $scope.displayMessage("Waiting for game to start...");
    $timeout($scope.getCurrentQuestion, 1000);
  };

  $scope.startQuestion = function (currentQuestion) {
    $scope.showMessage = false;
    $scope.showQuestion = true;
    $scope.showButtons = true;
    $scope.showYourAnswer = false;
    $scope.showCorrectAnswer = false;
    $scope.showPointsEarned = false;
    $scope.showReady = false;
    $scope.teamGuess = -1;
    $scope.answerText = "";
    $scope.updateButtons();
    $scope.getSubmittedAnswer();
    $scope.question = currentQuestion;
    $scope.questionStartTime = Date.now() - (currentQuestion.elapsedSeconds);
    $scope.timeToReadQuestion = currentQuestion.gracePeriod;
    $scope.timeToAnswerQuestion = currentQuestion.timeLimit;
    $scope.currentQuestion = currentQuestion.questionNumber + 1;
    $scope.numberOfQuestions = currentQuestion.numberOfQuestions;
    $scope.potentialPoints = 1000;
    $scope.startPointsTimer();
  };

  $scope.setCountDown = function (currentQuestion) {
    $scope.countDownToStartTime = Math.floor(currentQuestion.countdownTime);
    var secondsToStart = Math.floor($scope.countDownToStartTime / 1000);
    $scope.displayMessage("Game starting in " + secondsToStart + " seconds.");
    var countDownMillis = currentQuestion.countdownTime;
    var sleepTime = (countDownMillis < 1000) ? countDownMillis : 1000;
    $timeout($scope.getCurrentQuestion, sleepTime);
  };

  $scope.waitForNextQuestion = function (currentQuestion) {
    $scope.displayMessage("Ready For the Next Question?");
    $timeout($scope.getCurrentQuestion, currentQuestion.timeTillNextQuestion);
  };

  $scope.setGameEnded = function () {
    $scope.displayMessage("Well, that's it.  Thanks for playing!");
    $scope.leaderboardLink = "/#/leaderboard?gameCode=" + $scope.gameCode;
  };


  $scope.getSubmittedAnswer = function () {
    $http.get("/api/game/" + $scope.gameCode + "/submittedAnswer").success(function (submittedAnswer) {
      if (Object.keys(submittedAnswer).length > 0) {
        $scope.answerSubmitted = true;
        $scope.score = submittedAnswer.possibleScore;
        $scope.teamGuess = submittedAnswer.answer;
        $scope.updateButtons();
      }
    })
  };

  $scope.getCurrentQuestion = function () {
    $scope.potentialPoints = 0;
    $scope.answerSubmitted = false;
    $http.get("/api/game/" + $scope.gameCode + "/currentQuestion").success(function (response) {
      if (response.status == 'NOT_STARTED') {
        $scope.setNotStarted();
      } else if (response.status == 'COUNTDOWN') {
        $scope.setCountDown(response);
      } else if (response.status == 'SHOWING_ANSWER_FOR_CURRENT_QUESTION') {
        $scope.question = response.currentQuestion;
        $scope.showAnswer();
      } else if (response.status == 'GAME_ENDED') {
        $scope.setGameEnded(response);
      }
      else {
        $scope.updateScore();
        $scope.startQuestion(response);
      }
    }, function () {
      $scope.showError();
    });
  };


  $scope.updateLeaderboard = function () {

    scoresService.sorted()
      .then(function (scores) {
        $scope.leaderboardScores = scores;
      }, function () {
        $scope.leaderboardScores = [];
      })
  };

  $scope.getCurrentLeaderboard = function () {
    $scope.updateLeaderboard();
  };

  $scope.getPositiveTimeout = function (timeout) {
    if (timeout < 0) {
      return 0;
    }
    return timeout;
  };

  $scope.showAnswer = function () {
    $http.get("/api/game/" + $scope.gameCode + "/getAnswer").success(function (answerResult) {
      $scope.showButtons = false;
      $scope.answerText = answerResult.answerText;
      $scope.selectedAnswer = $scope.question.answerOptions[answerResult.yourAnswer];
      $scope.showYourAnswer = false;
      $scope.showQuestion = true;
      $scope.correctAnswer = $scope.question.answerOptions[answerResult.correctAnswer];

      $timeout(function () {
          $scope.showYourAnswer = true;
      }, $scope.getPositiveTimeout(answerResult.timeToNextQuestion - 29000));

      $timeout(function () {
        $scope.showCorrectAnswer = true;
      }, $scope.getPositiveTimeout(answerResult.timeToNextQuestion - 27000));

      $timeout(function () {
        $scope.showCorrectAnswer = true;
        $scope.pointsEarned = answerResult.score;
        $scope.updateLeaderboard();
        if ($scope.isUserPlaying()) {
          $scope.showPointsEarned = true;
        }
        $scope.updateScore();
      }, $scope.getPositiveTimeout(answerResult.timeToNextQuestion - 24000));

      $timeout(function () {
        $scope.showQuestion = false;
        $scope.showYourAnswer = false;
        $scope.showCorrectAnswer = false;
        $scope.showPointsEarned = false;
      }, $scope.getPositiveTimeout(answerResult.timeToNextQuestion - 6000));

      $timeout(function () {
        $scope.displayMessage("Ready for the next Question?");
      }, $scope.getPositiveTimeout(answerResult.timeToNextQuestion - 5000));

      $timeout(function () {
        $scope.getCurrentQuestion();
      }, $scope.getPositiveTimeout(answerResult.timeToNextQuestion + 300));
    }).error(function (data, status) {
      console.log("Too early to ask: " + status);
      $timeout($scope.showAnswer, 500);
    });
  };

  $scope.calculateProgressFromPoints = function () {
    var initialPoints = 1000;
    var heightPercent = ($scope.potentialPoints / initialPoints) * 100;

    if (heightPercent > 70) {
      $scope.barStyle = {'height': heightPercent + '%', 'background-color': '#20CC20'};
    } else if (heightPercent > 30) {
      $scope.barStyle = {'height': heightPercent + '%', 'background-color': '#CCCC20'};
    } else {
      $scope.barStyle = {'height': heightPercent + '%', 'background-color': '#CC2020'};
    }
  };


  $scope.showQuestions = function () {
    return $scope.numberOfQuestions > 0;
  };

  $scope.showScore = function () {
    return $scope.totalScore >= 0;
  };

  $scope.updateScore = function () {
    $http.get('/api/game/' + $scope.gameCode + '/score/').success(function (newScore) {
      if (newScore.totalScore >= 0) {
        $scope.totalScore = newScore.totalScore;
      }
    }).error(function (data, status, headers, config) {
      console.log("error getting score with status: " + status);
    })
  };

  $scope.getTeamName = function () {
    $http.get('/api/participant').success(function (participant) {
      $scope.teamName = participant.teamName;
    });
  };

  $scope.getButtonStyle = function (index) {
    var style = "";

    if (index === $scope.teamGuess) {
      style = "selected-answer-button";
    } else {
      style = "not-selected-answer-button";
    }
    if (index % 2 == 1) {
      style += " answer-button-last-in-row";
    }
    return style;
  };

  $scope.isUserPlaying = function () {
    return !($scope.watch);
  };


  $scope.updateButtons = function () {
    $scope.buttonStyle[0] = $scope.getButtonStyle(0);
    $scope.buttonStyle[1] = $scope.getButtonStyle(1);
    $scope.buttonStyle[2] = $scope.getButtonStyle(2);
    $scope.buttonStyle[3] = $scope.getButtonStyle(3);
  };

  var init = function () {
    $scope.potentialPoints = 0;
    $scope.barStyle = {'height': '100%', 'background-color': '#20CC20'};
    $scope.question = {};
    $scope.answerSubmitted = false;
    $scope.score = 1000;
    $scope.totalScore = 0;
    $scope.gameCode = $location.search().gameCode;
    $scope.watch = $location.search().watch === "true";
    $scope.numberOfQuestions = -1;
    $scope.teamGuess = -1;
    $scope.buttonStyle = [];
    $scope.updateButtons();
    $scope.getTeamName();
    $scope.leaderboardOffset = 0;
    $scope.getCurrentQuestion();
    $scope.getCurrentLeaderboard();
  };

  init();

};