var dbService = require('../service/db');
var constants = require('../constants');
var now = require("performance-now");
var _ = require('lodash');
var q = require('q');

var buildGuid = function () {
  var seed = now();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (char) {
    var random = (seed + Math.random() * 16) % 16 | 0;
    seed = Math.floor(seed / 16);
    return (char == 'x' ? random : (random & 0x3 | 0x8)).toString(16);
  });
};

var isValidJoinRequest = function (request) {
  return request != undefined &&
    request.body != undefined &&
    request.body.gameCode != undefined && request.body.gameCode.length > 1 &&
    request.body.teamName != undefined && request.body.teamName.length > 1;
};

exports.joinGame = function (request) {
  return dbService.getGame(request.body.gameCode).then(function (game) {
    if (game && isValidJoinRequest(request)) {
      var participantCode = buildGuid().toUpperCase();
      dbService.setupParticipant(request.body.gameCode, participantCode, request.body.teamName, true);
      return participantCode;
    }
  }).catch(function () {
    return null;
  });
};

exports.calculateCurrentQuestion = function (game) {
  var startTime = game.gameStartTime;
  var elapsedTime = (new Date() - startTime);
  var timeSinceStart = elapsedTime - constants.COUNTDOWN_TIME_BEFORE_GAME;
  return (timeSinceStart == 0) ? 0 : Math.floor(timeSinceStart / constants.TIME_PER_QUESTION);
};


var buildQuestionStatus = function (game, timeSinceFirstQuestion) {
  var questionNumber = exports.calculateCurrentQuestion(game);
  return dbService.getQuestion(game.group, questionNumber).then(function(currentQuestion) {
    return {
      status: "ANSWERING_QUESTION",
      questionText: currentQuestion.question,
      questionNumber: questionNumber,
      answerOptions: currentQuestion.answers,
      elapsedSeconds: timeSinceFirstQuestion - questionNumber * constants.TIME_PER_QUESTION,
      timeLimit: constants.TIME_TO_ANSWER_QUESTION,
      gracePeriod: constants.TIME_TO_READ_QUESTION,
      numberOfQuestions: game.numberOfQuestions
    }
  });
};

function getTimeSinceGameStart(now, gameStartTime) {
  return (now - gameStartTime);
}

function getTimeSinceFirstQuestion(now, startTime) {
  return getTimeSinceGameStart(now, startTime) - constants.COUNTDOWN_TIME_BEFORE_GAME;
}

function getTimeSinceLastQuestion(now, startTime) {
  return getTimeSinceFirstQuestion(now, startTime) % constants.TIME_PER_QUESTION;
}

function hasGameEnded(now, game) {
  return getTimeSinceGameStart(now, game.gameStartTime) >= game.numberOfQuestions * constants.TIME_PER_QUESTION + constants.COUNTDOWN_TIME_BEFORE_GAME;
}

exports.shouldShowAnswer = function (game) {
  return isShowingAnswerForQuestion(new Date(), game);
};

exports.timeToShowAnswer = function(game) {
  return constants.TIME_PER_QUESTION - (getTimeSinceLastQuestion(new Date(), game.gameStartTime));
};

function isShowingAnswerForQuestion(now, game) {
  return getTimeSinceLastQuestion(now, game.gameStartTime) >= constants.TIME_TO_ANSWER_QUESTION + constants.TIME_TO_READ_QUESTION;
}

function isBeforeFirstQuestion(now, game) {
  return getTimeSinceGameStart(now, game.gameStartTime) < constants.COUNTDOWN_TIME_BEFORE_GAME;
}

exports.calculateGameStatus = function (game) {
  var deferred = q.defer();
  var now = new Date();
  var returnValue = {status: game.status};
  if (game.status === "NOT_STARTED") {
    returnValue.status = "NOT_STARTED";
  }
  else if (isBeforeFirstQuestion(now, game)) {
    returnValue.status = "COUNTDOWN";
    returnValue.countdownTime = constants.COUNTDOWN_TIME_BEFORE_GAME - getTimeSinceGameStart(now, game.gameStartTime);
  }
  else if (hasGameEnded(now, game)) {
    returnValue.status = "GAME_ENDED";
  }
  else if (isShowingAnswerForQuestion(now, game)) {
    return buildQuestionStatus(game, getTimeSinceFirstQuestion(now, game.gameStartTime)).then(function(currentQuestion) {
      returnValue.questionNumber = exports.calculateCurrentQuestion(game);
      returnValue.status = "SHOWING_ANSWER_FOR_CURRENT_QUESTION";
      returnValue.timeTillNextQuestion = exports.timeToShowAnswer(game);
      returnValue.currentQuestion = currentQuestion;
      return returnValue;
    });
  }
  else {
    return buildQuestionStatus(game, getTimeSinceFirstQuestion(now, game.gameStartTime));
  }
  deferred.resolve(returnValue);
  return deferred.promise;
};

exports.getCurrentQuestion = function (gameCode) {
  return dbService.getGame(gameCode)
    .then(function (game) {
      return exports.calculateGameStatus(game);
    });
};

exports.getSubmittedAnswer = function(participantCode, gameCode) {
  return dbService.getGame(gameCode)
    .then(function (game) {
      var currentQuestion = exports.calculateCurrentQuestion(game);
      return dbService.getParticipantAnswers(gameCode, participantCode).then(function(answers) {
        var matchingAnswers = _.filter(answers, function(answer) { return answer.questionNumber == currentQuestion;});
        if(matchingAnswers.length > 0) {
          var answer = matchingAnswers.pop();
          delete answer.score;
          return answer;
        } else {
          return {};
        }
      });
    });
};

exports.getPlayerScore = function (gameCode, participantCode) {
  var currentQuestion = 0;
  return dbService.getGame(gameCode).then(function (game) {
    currentQuestion = exports.calculateCurrentQuestion(game);
    if (!isShowingAnswerForQuestion(new Date(), game)) {
      currentQuestion = currentQuestion - 1;
    }
    if (currentQuestion >= 0) {
      return dbService.getParticipantAnswers(gameCode, participantCode);
    } else {
      return [];
    }
  }).then(function (answers) {
    return _.reduce(_.filter(answers, function (answer) {
        return answer.questionNumber <= currentQuestion;
      }),
      function (sum, answer) {
        return sum + answer.score;
      }, 0);
  });
};

exports.getAllPlayersScores = function (gameCode) {
  return dbService.getParticipants(gameCode)
    .then(function (participants) {
      var mapPromises = _.map(participants, function (participant) {
        return exports.getPlayerScore(gameCode, participant.participantCode)
          .then(function (score) {
            return {participantCode: participant.participantCode,
              teamName: participant.teamName,
              totalScore: score}
          });
      });
      return q.all(mapPromises);
    });
};

exports.scoreQuestion = function (participantCode, gameCode, answer) {
  return dbService.getGame(gameCode).then(function (game) {
    var currentQuestionNumber = exports.calculateCurrentQuestion(game);
    var possibleScore = 0;
    var startTime = game.gameStartTime;
    var elapsedSeconds = (new Date() - startTime);
    var timeSinceStart = elapsedSeconds - constants.COUNTDOWN_TIME_BEFORE_GAME;
    var timeInQuestion = timeSinceStart % constants.TIME_PER_QUESTION;
    if (timeInQuestion < constants.TIME_TO_READ_QUESTION) {
      possibleScore = constants.MAX_SCORE;
    } else if (timeInQuestion > constants.TIME_TO_READ_QUESTION + constants.TIME_TO_ANSWER_QUESTION) {
      possibleScore = 0;
    } else {
      possibleScore = (constants.TIME_TO_ANSWER_QUESTION - (timeInQuestion - constants.TIME_TO_READ_QUESTION)) / constants.TIME_TO_ANSWER_QUESTION * constants.MAX_SCORE;
    }
    possibleScore = Math.round(possibleScore);
    return dbService.getQuestion(game.group, currentQuestionNumber).then(function(currentQuestion) {
      var actualScore = currentQuestion.correctAnswer === answer ? possibleScore : 0;
      return {
        questionNumber: currentQuestionNumber,
        possible: possibleScore,
        actual: actualScore
      };
    });
  });
};