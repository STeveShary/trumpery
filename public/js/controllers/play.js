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
                questionNumber: $scope.question.questionNumber,
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

  var getCurrentQuestion = function() {
    $http.get("/api/game/" + $scope.gameCode + "/currentQuestion").success(function(currentQuestion, status){
      if(status === 200) {
        $scope.showQuestion = true;
        $scope.showButtons = true;
        $scope.showYourAnswer = false;
        $scope.showCorrectAnswer = false;
        $scope.showPointsEarned = false;
        $scope.showReady = false;
        $scope.question = currentQuestion;
        $scope.questionStartTime = Date.now() - ($scope.question.elapsedSeconds * 1000);
        $scope.potentialPoints = 1000;
        $scope.startPointsTimer();
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
      var initialPoints = 1000
      $scope.progress = ($scope.potentialPoints/initialPoints)*100;
  }

  var init = function() {
    $scope.potentialPoints = 1000;
    $scope.progress = 100;
    $scope.question = {};
    $scope.answerSubmitted = false;
    $scope.score = 1000;
    $scope.gameCode = $location.search().gameCode;
    getCurrentQuestion();
  };

  init();
};