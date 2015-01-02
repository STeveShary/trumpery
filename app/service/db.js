// setup the database.
var mongo = require('mongoskin');
var db = mongo.db("mongodb://trumpery:trumpery@localhost:27017/trumpery", {native_parser: true});
var q = require('q');


var handleDbResponse = function(promise) {
    return function(err, data) {
        if(err) {
            promise.reject(err);
        } else {
            promise.resolve(data);
        }
    }
};

exports.getAllUsers = function () {
    var deferred = q.defer();
    db.collection('users').find().toArray(handleDbResponse(deferred));
    return deferred.promise;
};

exports.isValidGame = function (gameCode) {
    var deferred = q.defer();
    db.collection('games').findOne({gameCode: gameCode}, handleDbResponse(deferred));
    return deferred.promise;
};

exports.setupParticipant = function (gameCode, participantCode, teamName, players, isPlaying) {
    var deferred = q.defer();
    db.collection('participants').insert([
        {   gameCode: gameCode,
            participantCode: participantCode,
            teamName: teamName,
            players: players,
            isPlaying: isPlaying}], handleDbResponse(deferred));
    return deferred.promise;
};

exports.getParticipant = function(partipantCode) {
    var deferred = q.defer();
    db.collection('participants').findOne({participantCode: partipantCode}, handleDbResponse(deferred));
    return deferred.promise;
};