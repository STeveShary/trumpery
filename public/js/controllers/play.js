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

//  $scope.getPointsForQuestionForCurrentTime

  var getCurrentQuestion = function() {
    $http.get("/api/game/" + $scope.gameCode + "/currentQuestion").success(function(currentQuestion, status){
      if(status === 200) {
        $scope.question = currentQuestion;
      } else {
        showError();
      }
    }, function(err) {
      showError();
    });
  };


  var init = function() {
    $scope.question = {};
    $scope.answerSubmitted = false;
    $scope.score = 1000;
    $scope.gameCode = $location.search().gameCode;
    getCurrentQuestion();
  };

  init();
};