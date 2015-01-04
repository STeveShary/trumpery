var dbService = require('../../app/service/db');


var buildGuid = function () {
    var d = performance.now();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
};

exports.isValidJoinRequest = function (request) {
    return request != null &&
        request.body != null &&
        request.body.gameCode != null && request.body.gameCode.length > 1 &&
        request.body.teamName != null && reqeust.body.teamName.length > 1 &&
        request.body.players != null && request.body.players.length > 0;
};

exports.joinGame = function (request) {
    return dbService.isValidGame(request.body.gameCode).then(function (isValidGame) {
        if (isValidGame && isValidJoinRequest(request)) {
            var participantCode = buildGuid();
            dbService.setupParticipant(request.body.gameCode, participantCode, request.body.teamName,
                request.body.players, true);
            return participantCode;
        }
    });
};
