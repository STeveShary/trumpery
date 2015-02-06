var express = require('express');
var dbService = require('../app/service/db');
var gameController = require('../app/controller/gameController');
var constants = require('./constants');
var router = express.Router();
var _ = require('lodash');

router.get('/allUsers', function (request, response) {
  dbService.getAllUsers()
    .then(function (users) {
      response.json(users);
    });
});

router.post('/api/game/create', function (request, response) {
  dbService.createGame(request.body.gameName).then(function (result) {
    response.status(200).json(result);
  });
});

router.get('/api/game/all', function (request, response) {
  dbService.getAllGames().then(
    function (allGames) {
      response.status(200).json(allGames);
    });
});

router.get('/api/game/gameStatus', function (request, response) {
  dbService.getGame(request.query.gameCode).then(function (game) {
    response.status(200).json({isValidGame: game,
                               gameCode: game.gameCode,
                               status: gameController.calculateGameStatus(game).status});
  });
});

router.post('/api/game/join', function (request, response) {
  gameController.joinGame(request).then(function (participantCode) {
    response.status(200)
      .cookie('participantCode', participantCode, { maxAge: 7200000})
      .cookie('gameCode', request.body.gameCode, { maxAge: 7200000})
      .end();
  }, function (err) {
    response.status(400).json(err);
  });
});

router.post('/api/game/delete', function (request, response) {
  dbService.deleteGame(request.body.gameCode).then(function (result) {
    response.status(200).json(result);
  });
});

router.post('/api/game/updateStatus', function (request, response) {
  dbService.updateGameStatus(request.body.gameCode, request.body.status).then(function (result) {
    response.status(200).json(result);
  });
});

router.get('/api/participant', function (request, response) {
  var participantCode = request.cookies.participantCode;
  dbService.getParticipant(participantCode).then(function (participant) {
    response.status(200).json({teamName: participant.teamName,
                               participantCode: participant.participantCode,
                               gameCode: participant.gameCode});
  })
});

router.get('/api/gameParticipants', function (request, response) {
  dbService.getParticipants(request.query.gameCode).then(function (participants) {
    response.status(200).json(participants);
  });
});

router.get('/api/game/:gameCode/currentQuestion', function (request, response) {
  var gameCode = request.params.gameCode;
  gameController.getCurrentQuestion(gameCode).then(function (question) {
    response.status(200).json(question);
  }).catch(function (err) {
    request.next(err);
  });
});

router.get('/api/game/:gameCode/getAnswer', function (request, response) {
  dbService.getGame(request.params.gameCode).then(function (game) {
    if (gameController.shouldShowAnswer(game)) {
      var currentQuestionAnswer = gameController.calculateCurrentQuestion(game);
      dbService.getResponse(request.cookies.participantCode, currentQuestionAnswer).then(function (answerResponse) {
        if (answerResponse == null) {
          answerResponse = {answer: null, score: 0};
        }
        var responseBody = {
          yourAnswer: answerResponse.answer,
          correctAnswer: constants.questions[currentQuestionAnswer].correctAnswer,
          answerText: constants.questions[currentQuestionAnswer].answerText,
          score: answerResponse.score,
          timeToNextQuestion: gameController.timeToShowAnswer(game)

        };
        response.status(200).json(responseBody);
      });
    } else {
      response.status(401).end();
    }
  }).catch(function (err) {
    console.log(err);
    response.status(500).json(err.message);
  });
});

router.get('/api/game/:gameCode/submittedAnswer', function (request, response) {
  var gameCode = request.params.gameCode;
  var participantCode = request.cookies.participantCode;
  gameController.getSubmittedAnswer(participantCode, gameCode).then(function (answer) {
    response.status(200).json(answer);
  })
});

router.post('/api/game/:gameCode/submitAnswer', function (request, response) {
  var gameCode = request.params.gameCode,
    answer = request.body.answer,
    participantCode = request.cookies.participantCode;
  var scope = {};
  gameController.scoreQuestion(participantCode, gameCode, answer).then(function (score) {
    scope.score = score;
    return dbService.saveAnswer(participantCode, gameCode, score.questionNumber, answer, score.actual, score.possible);
  }).then(function () {
    response.status(200).json({
      score: scope.score.possible
    });
  });
});

router.get('/api/game/:gameCode/score/', function (request, response) {
  var gameCode = request.params.gameCode;
  gameController.getPlayerScore(gameCode, request.cookies.participantCode).then(function (score) {
    response.status(200).json({totalScore: score});
  });
});

router.get('/api/game/:gameCode/scores', function (request, response) {
  var gameCode = request.params.gameCode;
  gameController.getAllPlayersScores(gameCode).then(function (scores) {
    response.status(200).json(scores);
  }).catch(function (err) {
    console.log(err);
    response.status(500).json(err.message);
  });
});

module.exports = router;
