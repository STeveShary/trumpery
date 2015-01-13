var playGameController = function($scope, $location, $http, $timeout) {

  var showError = function() {
    $scope.errorMessage = "Question not available";
    $scope.showError = true;
    $timeout(function () {
      $scope.showError = false;
    }, 5000);
  };


  $scope.submitAnswer = function(answerIndex) {
    var body = {gameCode: $scope.gameCode,
                answer:answerIndex};
    $http.post("/api/game/" + $scope.gameCode + "/submitAnswer", body).success(function(scoreResult){
      $scope.score = scoreResult.score;
      $scope.answerSubmitted = true;
    });
  };

  $scope.calcPotentialPoints = function() {
    var pointsDeducted = (Date.now() - ($scope.questionStartTime + 5000)) / 10;
    if(pointsDeducted < 0) {
      pointsDeducted = 0;
    }
    return Math.floor(1000 - pointsDeducted);
  };

  $scope.updatePotentialPoints = function() {
    var potentialPoints = $scope.calcPotentialPoints();
    if(potentialPoints < 0) {
      potentialPoints = 0;
    }
    $scope.potentialPoints = potentialPoints;
    if(!$scope.answerSubmitted) {
      $scope.score = $scope.potentialPoints;
    }
    calculateProgressFromPoints();
  };

  $scope.startPointsTimer = function() {
    $timeout(function() {
      $scope.updatePotentialPoints();
      if($scope.potentialPoints > 0) {
        $scope.startPointsTimer();
      } else {
        showAnswer();
      }
    }, 10);
  };

  var showMessage = function(message) {
    $scope.message = message;
    $scope.showYourAnswer = false;
    $scope.showMessage = true;
    $scope.showQuestion = false;
  };


  var setNotStarted = function() {
    showMessage("Waiting for game to start...");
    $timeout(getCurrentQuestion,1000);
  };

  var startQuestion = function(currentQuestion) {
    $scope.showMessage = false;
    $scope.showQuestion = true;
    $scope.showButtons = true;
    $scope.showYourAnswer = false;
    $scope.showCorrectAnswer = false;
    $scope.showPointsEarned = false;
    $scope.showReady = false;
    $scope.question = currentQuestion;
    $scope.questionStartTime = Date.now() - ($scope.question.elapsedSeconds * 1000);
    $scope.health = '20CC20';
    $scope.potentialPoints = 1000;
    $scope.startPointsTimer();
  };

  var setCountDown = function(currentQuestion) {
    $scope.countDownToStartTime = Math.floor(currentQuestion.countdownTime);
    showMessage("Game starting in "+ $scope.countDownToStartTime + " seconds.");
    var countDownMillis = currentQuestion.countdownTime * 1000;
    var sleepTime = (countDownMillis < 1000) ? countDownMillis : 1000;
    $timeout(getCurrentQuestion, sleepTime);
  };

  var waitForNextQuestion = function(currentQuestion) {
    showMessage("Ready For the Next Question?");
    $scope.timeToNextQuestion = Math.floor(currentQuestion.waitTime)*1000;
    $timeout(getCurrentQuestion, $scope.timeToNextQuestion);
  };

  var setGameEnded = function(questionResponse) {
    showMessage("The Game has ended.");
  };

  var getCurrentQuestion = function() {
    $http.get("/api/game/" + $scope.gameCode + "/currentQuestion").success(function(questionResponse, status){
      if(status === 200) {
        if(questionResponse.status === 'NOT_STARTED') {
          setNotStarted();
        } else if(questionResponse.status === 'COUNTDOWN') {
          setCountDown(questionResponse);
        } else if(questionResponse.status === 'WAIT_TIME'){
           waitForNextQuestion(questionResponse);
        } else if(questionResponse.status === 'GAME_ENDED') {
          setGameEnded(questionResponse);
        }
        else {
          startQuestion(questionResponse);
        }
      } else {
        showError();
      }
    }, function(err) {
      showError();
    });
  };

  var showAnswer = function() {
    $http.get("/api/game/getAnswer?questionNumber=" + $scope.question.questionNumber).success(function(answerResult){
      $scope.showButtons = false;
      $scope.selectedAnswer = $scope.question.answerOptions[answerResult.yourAnswer];
      $scope.showYourAnswer = true;
      $timeout(function() {
        $scope.correctAnswer = $scope.question.answerOptions[answerResult.correctAnswer];
        $scope.showCorrectAnswer = true;
      }, 1000);

      $timeout(function() {
        $scope.pointsEarned = answerResult.score;
        $scope.showPointsEarned = true;
      }, 2000);


      $timeout(function() {
        $scope.showQuestion = false;
        $scope.showYourAnswer = false;
        $scope.showCorrectAnswer = false;
        $scope.showPointsEarned = false;
        $scope.showReady = true;
      }, 5000);


      $timeout(function() {
        getCurrentQuestion();
      }, 8000); //TODO: get time till next question.
    });
  };

  var calculateProgressFromPoints = function() {
      var initialPoints = 1000;
      $scope.progress = ($scope.potentialPoints/initialPoints)*100;
      if( $scope.progress < 70 && $scope.health != 'CCCC20' && $scope.health != 'CC2020' ) {
        $scope.health = 'CCCC20';
      } else if( $scope.progress < 30 && $scope.health != 'CC2020'  ) {
        $scope.health = 'CC2020';
      }
  }

  var init = function() {
    $scope.potentialPoints = 1000;
    $scope.progress = 100;
    $scope.health = '20CC20';
    $scope.question = {};
    $scope.answerSubmitted = false;
    $scope.score = 1000;
    $scope.gameCode = $location.search().gameCode;
    getCurrentQuestion();
  };

  init();
};