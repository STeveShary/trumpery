var express = require('express');
var dbService = require('../app/service/db');
var joinController = require('../app/controller/gameController');
var router = express.Router();

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

module.exports = router;
