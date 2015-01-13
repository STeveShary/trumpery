var dbService = require('../../app/service/db');
var now = require("performance-now");

exports.getCurrentQuestion = function (request) {
    return dbService.isValidGame(request.body.gameCode).then(function (isValidGame) {
        if (isValidGame && isValidJoinRequest(request)) {
            var participantCode = buildGuid().toUpperCase();
            var nonEmptyPlayers = request.body.players.filter(function(player) { return player != undefined && player.length > 0});
            dbService.setupParticipant(request.body.gameCode, participantCode, request.body.teamName,
                nonEmptyPlayers, true);
            return participantCode;
        }
    });
};