var express = require('express');
var dbService = require('../app/service/db');
var gameController = require('../app/controller/gameController');
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

var timeLimit = 30;
var gracePeriod = 5;
var maxScore = 1000;


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
   gameController.joinGame(request).then(function(participantCode) {
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
  gameController.getCurrentQuestion(gameCode).then(function(question) {
    response.status(200).json(question);
  }).catch(function(err) {
    request.next(err);
  });
});

router.get('/api/game/getAnswer', function(request, response) {
  var questionNumber = request.query.questionNumber;
  dbService.getResponse(request.cookies.participantCode, questionNumber).then(function(questionResponse) {
    var question = questions[questionNumber];
    response.status(200).json({
      yourAnswer: questionResponse.answer,
      correctAnswer: answers[questionNumber],
      answerText: question.answerOptions[answers[questionNumber]],
      score: questionResponse.score
    });
  }).catch(function(err) {
    response.status(500).json(err.message);
  });
});

router.post('/api/game/:gameCode/submitAnswer', function(request, response) {
  var gameCode = request.params.gameCode,
    answer = request.body.answer,
    participantCode = request.cookies.participantCode;
  var scope = {};
  gameController.scoreQuestion(participantCode, gameCode, answer).then(function(score) {
    scope.score = score;
    return dbService.saveAnswer(participantCode, gameCode, score.questionNumber, answer, score.actual);
  }).then(function() {
    response.status(200).json({
      score: scope.score.possible
    });
  });
});

router.get('/api/game/:gameCode/scores', function(request, response) {
  var scope = {};
  dbService.getParticipantsWithScores(request.params.gameCode).then(function(data) {
    scope.scores = data;
    scope.participants = _.map(data, function(it) {
      return data._id.participantCode;
    });
    return dbService.getParticipants(gameCode);
  }).then(function(ps) {
   return _.map(ps, function(it) {
      return {
        teamName: it.teamName,
        score: _.find(scope.scores, function(score) {
          return score._id.participantCode === it.participantCode
        })[0].score
      };
    })
  }).then(function(scores) {
    response.status(200).json(scores);
  }).catch(function(err) {
    response.status(500).json(err.message);
  });
});

module.exports = router;
