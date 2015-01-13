var dbService = require('../../app/service/db');
var now = require("performance-now");


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