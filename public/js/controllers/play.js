var playGameController = function ($scope, $location, $http, $timeout) {


    var showError = function () {
        $scope.errorMessage = "Question not available";
        $scope.showError = true;
        $timeout(function () {
            $scope.showError = false;
        }, 5000);
    };


    $scope.submitAnswer = function (answerIndex) {
        if(answerIndex === $scope.teamGuess) return;
        var body = {gameCode: $scope.gameCode,
            answer: answerIndex};
        $http.post("/api/game/" + $scope.gameCode + "/submitAnswer", body).success(function (scoreResult) {
            $scope.score = scoreResult.score;
            $scope.answerSubmitted = true;
            $scope.teamGuess = answerIndex;
            $scope.updateButtons();
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
        calculateProgressFromPoints();
    };

    $scope.startPointsTimer = function () {
        $timeout(function () {
            $scope.updatePotentialPoints();
            if ($scope.potentialPoints > 0) {
                $scope.startPointsTimer();
            } else {
                showAnswer();
            }
        }, 10);
    };

    var showMessage = function (message) {
        $scope.message = message;
        $scope.showYourAnswer = false;
        $scope.showMessage = true;
        $scope.showQuestion = false;
    };


    var setNotStarted = function () {
        showMessage("Waiting for game to start...");
        $timeout(getCurrentQuestion, 1000);
    };

    var startQuestion = function (currentQuestion) {
        $scope.showMessage = false;
        $scope.showQuestion = true;
        $scope.showButtons = true;
        $scope.showYourAnswer = false;
        $scope.showCorrectAnswer = false;
        $scope.showPointsEarned = false;
        $scope.showReady = false;
        $scope.teamGuess = -1;
        $scope.updateButtons();
        $scope.question = currentQuestion;
        $scope.questionStartTime = Date.now() - (currentQuestion.elapsedSeconds);
        $scope.timeToReadQuestion = currentQuestion.gracePeriod;
        $scope.timeToAnswerQuestion = currentQuestion.timeLimit;
        $scope.currentQuestion = currentQuestion.questionNumber + 1;
        $scope.numberOfQuestions = currentQuestion.numberOfQuestions;
        $scope.health = '20CC20';
        $scope.potentialPoints = 1000;
        $scope.startPointsTimer();
    };

    var setCountDown = function (currentQuestion) {
        $scope.countDownToStartTime = Math.floor(currentQuestion.countdownTime);
        var secondsToStart = Math.floor($scope.countDownToStartTime / 1000);
        showMessage("Game starting in " + secondsToStart + " seconds.");
        var countDownMillis = currentQuestion.countdownTime;
        var sleepTime = (countDownMillis < 1000) ? countDownMillis : 1000;
        $timeout(getCurrentQuestion, sleepTime);
    };

    var waitForNextQuestion = function (currentQuestion) {
        showMessage("Ready For the Next Question?");
        $scope.timeToNextQuestion = Math.floor(currentQuestion.TIME_TILL_NEXT_QUESTION) * 1000;
        $timeout(getCurrentQuestion, $scope.timeToNextQuestion);
    };

    var setGameEnded = function () {
        showMessage("The Game has ended.");
    };

    var getCurrentQuestion = function () {
        $scope.updateScore();
        $scope.potentialPoints = 0;
        $scope.answerSubmitted = false;
        $http.get("/api/game/" + $scope.gameCode + "/currentQuestion").success(function (response) {
            if (response.status == 'NOT_STARTED') {
                setNotStarted();
            } else if (response.status == 'COUNTDOWN') {
                setCountDown(response);
            } else if (response.status == 'SHOWING_ANSWER_FOR_CURRENT_QUESTION') {
                waitForNextQuestion(response);
            } else if (response.status == 'GAME_ENDED') {
                setGameEnded(response);
            }
            else {
                startQuestion(response);
            }
        }, function (err) {
            showError();
        });
    };

    var showAnswer = function () {
        $http.get("/api/game/" + $scope.gameCode + "/getAnswer").success(function (answerResult) {
            $scope.showButtons = false;
            $scope.selectedAnswer = $scope.question.answerOptions[answerResult.yourAnswer];
            $scope.showYourAnswer = true;
            $timeout(function () {
                $scope.correctAnswer = $scope.question.answerOptions[answerResult.correctAnswer];
                $scope.showCorrectAnswer = true;
            }, 1000);

            $timeout(function () {
                $scope.pointsEarned = answerResult.score;
                $scope.showPointsEarned = true;
                $scope.updateScore();
            }, 2000);


            $timeout(function () {
                $scope.showQuestion = false;
                $scope.showYourAnswer = false;
                $scope.showCorrectAnswer = false;
                $scope.showPointsEarned = false;
                $scope.showReady = true;
            }, 5000);

            $timeout(function () {
                getCurrentQuestion();
            }, 8000);
        });
    };

    var calculateProgressFromPoints = function () {
        var initialPoints = 1000;
        $scope.progress = ($scope.potentialPoints / initialPoints) * 100;
        if ($scope.progress < 70 && $scope.health != 'CCCC20' && $scope.health != 'CC2020') {
            $scope.health = 'CCCC20';
        } else if ($scope.progress < 30 && $scope.health != 'CC2020') {
            $scope.health = 'CC2020';
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
        })
    };

    $scope.getTeamName = function () {
        $http.get('/api/participant').success(function (participant) {
            $scope.teamName = participant.teamName;
        });
    };

    $scope.getButtonStyle = function(index)
    {
        if (index === $scope.teamGuess) {
            return "selected-answer-button";
        }
        return "not-selected-answer-button";
    }


    $scope.updateButtons = function () {
        $scope.buttonStyle[0] = $scope.getButtonStyle(0);
        $scope.buttonStyle[1] = $scope.getButtonStyle(1);
        $scope.buttonStyle[2] = $scope.getButtonStyle(2);
        $scope.buttonStyle[3] = $scope.getButtonStyle(3);
    };

    var init = function () {
        $scope.potentialPoints = 0;
        $scope.progress = 100;
        $scope.health = '20CC20';
        $scope.question = {};
        $scope.answerSubmitted = false;
        $scope.score = 1000;
        $scope.totalScore = -1;
        $scope.gameCode = $location.search().gameCode;
        $scope.numberOfQuestions = -1;
        $scope.teamGuess = -1;
        $scope.buttonStyle = [];
        $scope.updateButtons();
        $scope.getTeamName();
        getCurrentQuestion();
    };

    init();
};