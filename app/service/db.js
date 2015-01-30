// setup the database.
var mongo = require('mongoskin');
var db = mongo.db("mongodb://trumpery:trumpery@localhost:27017/trumpery", {native_parser: true});
var q = require('q');
var now = require("performance-now");

var buildGameCode = function () {
  var seed = now();
  var uuid = 'xxxxx'.replace(/[xy]/g, function (char) {
    var random = (seed + Math.random() * 16) % 16 | 0;
    seed = Math.floor(seed / 16);
    return (char == 'x' ? random : (random & 0x3 | 0x8)).toString(16);
  });
  return uuid;
};

var handleDbResponse = function (promise) {
  return function (err, data) {
    if (err) {
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

exports.createGame = function (gameName) {
  var deferred = q.defer();
  var newGameDocument = {gameName: gameName,
                         gameCode: buildGameCode(),
                         status: "NOT_STARTED"};
  db.collection('games').insert(newGameDocument, function (err, data) {
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve(newGameDocument);
    }});
  return deferred.promise;
};

exports.getAllGames = function () {
  var deferred = q.defer();
  db.collection('games').find().toArray(handleDbResponse(deferred));
  return deferred.promise;
};

exports.deleteGame = function(gameCode) {
  var deferred = q.defer();
  db.collection('games').remove({gameCode: gameCode}, handleDbResponse(deferred));
  return deferred.promise;
};

exports.updateGameStatus = function(gameCode, status) {
  var deferred = q.defer();
  db.collection('games').update({gameCode: gameCode}, {$set: {status: status}}, handleDbResponse(deferred));
  return deferred.promise;
}

exports.isValidGame = function (gameCode) {
  var deferred = q.defer();
  db.collection('games').findOne({gameCode: gameCode}, function (err, data) {
    if (err) {
      deferred.reject(false);
    } else {
      var isValid = data != null;
      deferred.resolve(isValid);
    }
  });
  return deferred.promise;
};

exports.setupParticipant = function (gameCode, participantCode, teamName, players, isPlaying) {
  var deferred = q.defer();
  db.collection('participants').insert([
    {   gameCode: gameCode,
      participantCode: participantCode,
      teamName: teamName,
      players: players,
      isPlaying: isPlaying}
  ], handleDbResponse(deferred));
  return deferred.promise;
};

exports.getParticipant = function (partipantCode) {
  var deferred = q.defer();
  db.collection('participants').findOne({participantCode: partipantCode}, handleDbResponse(deferred));
  return deferred.promise;
};

exports.getParticipants = function (gameCode) {
  var deferred = q.defer();
  db.collection('participants').find({gameCode: gameCode}).toArray(handleDbResponse(deferred));
  return deferred.promise;
}