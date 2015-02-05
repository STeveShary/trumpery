var express = require('express');
var dbService = require('../app/service/db');
var joinController = require('../app/controller/gameController');
var questionController = require('../app/controller/questionController');
var router = express.Router();

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

var currentQuestion = 0;



router.get('/allUsers', function (request, response) {
    dbService.getAllUsers()
        .then(function (users) {
            response.json(users);
        });
});

router.post('/api/game/create', function(request, response) {
  dbService.createGame(request.body.gameName).then(function(result) {
    response.status(200).json(result);
  });
});

router.get('/api/game/all', function(request, response) {
  dbService.getAllGames().then(
    function(allGames) {
      response.status(200).json(allGames);
    });
});

router.get('/api/game/isValid', function(request, response) {
    dbService.isValidGame(request.query.gameCode).then(function(isValid) {
        response.status(200).json({isValidGame: isValid});
    });
});

router.post('/api/game/join', function (request, response) {
   joinController.joinGame(request).then(function(participantCode) {
       response.status(200)
           .cookie('participantCode', participantCode, { maxAge: 7200000, httpOnly: true })
           .end();
   }, function(err) {
       response.status(400).json(err);
   });
});

router.post('/api/game/delete', function(request, response) {
  dbService.deleteGame(request.body.gameCode).then(function(result) {
    response.status(200).json(result);
  });
});

router.post('/api/game/updateStatus', function(request, response) {
  dbService.updateGameStatus(request.body.gameCode, request.body.status).then(function(result) {
    response.status(200).json(result);
  });
});

router.get('/api/gameParticipants', function(request, response) {
   dbService.getParticipants(request.query.gameCode).then(function(participants) {
       response.status(200).json(participants);
   });
});

router.get('/api/game/:gameCode/currentQuestion', function(request, response) {
  var gameCode = request.params.gameCode;
  dbService.isValidGame(gameCode).then(function() {
    var question = questions[currentQuestion];
    response.status(200).json({
      questionText: question.questionText,
      questionNumber: currentQuestion,
      answerOptions: question.answerOptions,
      elapsedSeconds: 10
    });
  });
});

router.get('/api/game/:gameCode/getAnswer', function(request, response) {
  var gameCode = request.params.gameCode,
     questionNumber = request.query.questionNumber;
  dbService.isValidGame(gameCode).then(function() {
    var question = questions[questionNumber];
    response.status(200).json({
      yourAnswer: 0,
      correctAnswer: answers[questionNumber],
      answerText: question.answerOptions[answers[questionNumber]]
    });
  });
});

router.post('/api/game/:gameCode/submitAnswer', function(request, response) {
  var gameCode = request.params.gameCode,
    questionNumber = request.body.questionNumber,
    answer = request.body.answer;
  dbService.isValidGame(gameCode).then(function() {
    var question = questions[questionNumber];
    response.status(200).json({
      score: 799
    });
  });
});

router.get('/api/game/:gameCode/scores', function(request, response) {
  response.status(200).json([{
    teamName: 'xyz',
    score: '8000'
  }, {
    teamName: 'qwerty',
    score: '1000'
  }]);
});

module.exports = router;
