var dbService = require('../../app/service/db');
var now = require("performance-now");
var q = require('q');

var questions = [{
  questionText: "What is your name?",
  answerOptions: ["Sir Arthur of Camelot", "Sir Robin", "Sir Galahad", "Sir Zach"]
}, {
  questionText: "What is your quest?",
  answerOptions: ["To seek the holy grail", "to do stuff", "to do other stuff", "to get all the questions right"]
}, {
  questionText: "What is the airspeed velocity of an unladen swallow?",
  answerOptions: ["African or European swallow?", "I don't know that!", "15mph", "raggle fraggle"]
}];

var answers = [0, 0, 2];

var countdownTime = 10;
var timeLimit = 30;
var gracePeriod = 5;
var waitTime = 10;
var maxScore = 1000;
var timePerQuestion = timeLimit + gracePeriod + waitTime;

var buildGuid = function () {
    var seed = now();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (char) {
        var random = (seed + Math.random() * 16) % 16 | 0;
        seed = Math.floor(seed / 16);
        return (char == 'x' ? random : (random & 0x3 | 0x8)).toString(16);
    });
    return uuid;
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
            var nonEmptyPlayers = request.body.players.filter(function(player) { return player != undefined && player.length > 0});
            dbService.setupParticipant(request.body.gameCode, participantCode, request.body.teamName,
                nonEmptyPlayers, true);
            return participantCode;
        }
    }).fail(function() {
      console.log("not a valid game");
      return null;
    });
};

var calculateCurrentQuestion = function(game) {
  var startTime = game.gameStartTime,
    elapsedTime = (new Date() - startTime) / 1000;
  var timeSinceStart = elapsedTime - countdownTime;
  var timeInQuestion = timeSinceStart % timePerQuestion;

  var questionNumber = Math.floor(timeSinceStart / timePerQuestion);
  return questionNumber;
};

exports.getCurrentQuestion = function(gameCode) {
  return dbService.isValidGame(gameCode).then(function (game) {
    var startTime = game.gameStartTime,
      elapsedTime = (new Date() - startTime) / 1000;
    var timeSinceStart = elapsedTime - countdownTime;
    var timeInQuestion = timeSinceStart % timePerQuestion;
    if(game.status === "NOT_STARTED") {
      return {
        status: "NOT_STARTED"
      };
    } else if(elapsedTime < countdownTime) {
      return {
        status: "COUNTDOWN",
        countdownTime: countdownTime - elapsedTime
      }
    } else if(elapsedTime > questions.length * timePerQuestion + countdownTime) {
      return {
        status: "GAME_ENDED"
      }
    } else if(timeInQuestion > timeLimit + gracePeriod) {
      return {
        status: "WAIT_TIME",
        waitTime: timeInQuestion - (timeLimit + gracePeriod)
      }
    } else {
      var questionNumber = calculateCurrentQuestion(game);
      var currentQuestion = questions[questionNumber];
      return {
        status: "QUESTION",
        questionText: currentQuestion.questionText,
        questionNumber: questionNumber,
        answerOptions: currentQuestion.answerOptions,
        elapsedSeconds: timeSinceStart - questionNumber * timePerQuestion,
        gracePeriod: gracePeriod
      };
    }
  });
};

exports.scoreQuestion = function(participantCode, gameCode, answer) {
  return dbService.isValidGame(gameCode).then(function(game) {
    var currentQuestion = calculateCurrentQuestion(game);
    var possibleScore = 0;
    var startTime = game.gameStartTime;
    var elapsedSeconds = (new Date() - startTime) / 1000;
    if(elapsedSeconds < gracePeriod) {
      possibleScore = maxScore;
    } else if(elapsedSeconds > gracePeriod + timeLimit) {
      possibleScore = 0;
    } else {
      possibleScore = (timeLimit + gracePeriod - elapsedSeconds) / timeLimit * maxScore;
    }
    possibleScore = Math.round(possibleScore);
    var actualScore = answers[currentQuestion] === answer ? possibleScore : 0;

    return {
      questionNumber: currentQuestion,
      possible: possibleScore,
      actual: actualScore
    };
  });
};