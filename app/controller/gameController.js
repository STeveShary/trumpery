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
    request.body.teamName != undefined && request.body.teamName.length > 1 &&
    request.body.players != undefined && request.body.players.length > 0;
};

exports.joinGame = function (request) {
  return dbService.isValidGame(request.body.gameCode).then(function (game) {
    if (game && isValidJoinRequest(request)) {
      var participantCode = buildGuid().toUpperCase();
      var nonEmptyPlayers = request.body.players.filter(function (player) {
        return player != undefined && player.length > 0
      });
      dbService.setupParticipant(request.body.gameCode, participantCode, request.body.teamName,
        nonEmptyPlayers, true);
      return participantCode;
    }
  }).fail(function () {
    console.log("not a valid game");
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
  var currentQuestion = constants.questions[questionNumber];
  return {
    status: "ANSWERING_QUESTION",
    questionText: currentQuestion.questionText,
    questionNumber: questionNumber,
    answerOptions: currentQuestion.answerOptions,
    elapsedSeconds: timeSinceFirstQuestion - questionNumber * constants.TIME_PER_QUESTION,
    timeLimit: constants.TIME_TO_ANSWER_QUESTION,
    gracePeriod: constants.TIME_TO_READ_QUESTION,
    numberOfQuestions: constants.questions.length
  }
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
  return getTimeSinceGameStart(now, game.gameStartTime) >= constants.questions.length * constants.TIME_PER_QUESTION + constants.COUNTDOWN_TIME_BEFORE_GAME;
}

exports.shouldShowAnswer = function (game) {
  return isShowingAnswerForQuestion(new Date(), game);
};

function isShowingAnswerForQuestion(now, game) {
  return getTimeSinceLastQuestion(now, game.gameStartTime) >= constants.TIME_TO_ANSWER_QUESTION + constants.TIME_TO_READ_QUESTION;
}

function isBeforeFirstQuestion(now, game) {
  return getTimeSinceGameStart(now, game.gameStartTime) < constants.COUNTDOWN_TIME_BEFORE_GAME;
}

exports.calculateGameStatus = function (game) {
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
    returnValue.questionNumber = exports.calculateCurrentQuestion(game);
    returnValue.status = "SHOWING_ANSWER_FOR_CURRENT_QUESTION";
    returnValue.timeTillNextQuestion = constants.TIME_TILL_NEXT_QUESTION - (getTimeSinceLastQuestion(now, game.gameStartTime) - (constants.TIME_TO_ANSWER_QUESTION + constants.TIME_TO_READ_QUESTION));
  }
  else {
    return buildQuestionStatus(game, getTimeSinceFirstQuestion(now, game.gameStartTime));
  }
  return returnValue;
};

exports.getCurrentQuestion = function (gameCode) {
  return dbService.isValidGame(gameCode)
    .then(function (game) {
      return exports.calculateGameStatus(game);
    });
};

exports.getPlayerScore = function (gameCode, participantCode) {
  var currentQuestion = 0;
  return dbService.isValidGame(gameCode).then(function (game) {
    currentQuestion = exports.calculateCurrentQuestion(game);
    if (!isShowingAnswerForQuestion(new Date(), game)) {
      currentQuestion = currentQuestion - 1;
    }
    console.log("Got the current question to calculate the score.");
    if (currentQuestion >= 0) {
      return dbService.getParticipantAnswers(gameCode, participantCode);
    } else {
      return [];
    }
  }).then(function (answers) {
    console.log("Got the current answers for the player.  Returning those soon!");
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
  return dbService.isValidGame(gameCode).then(function (game) {
    var currentQuestion = exports.calculateCurrentQuestion(game);
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
    var actualScore = constants.answers[currentQuestion] === answer ? possibleScore : 0;

    return {
      questionNumber: currentQuestion,
      possible: possibleScore,
      actual: actualScore
    };
  });
};