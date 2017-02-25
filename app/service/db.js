// setup the database.
var mongojs = require('mongojs');
var db = mongojs("mongodb://trumpery:trumpery@mongo:27017/trumpery", ['games', 'users', 'participants', 'responses', 'questions']);
var q = require('q');
var util = require('../util');
var question = require('./question');

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
    db.collection('users').find(handleDbResponse(deferred));
    return deferred.promise;
};

exports.createGame = function (gameName, group, numberOfQuestions) {
    var deferred = q.defer();
    var newGameDocument = {gameName: gameName,
        gameCode: util.buildGameCode(),
        group: group,
        numberOfQuestions: numberOfQuestions,
        status: "NOT_STARTED"};
    db.collection('games').insert(newGameDocument, function (err, data) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(newGameDocument);
        }
    });
    return deferred.promise;
};

exports.getAllGames = function () {
    var deferred = q.defer();
    db.collection('games').find(handleDbResponse(deferred));
    return deferred.promise;
};

exports.deleteGame = function (gameCode) {
    var deferred = q.defer();
    db.collection('games').remove({gameCode: gameCode}, handleDbResponse(deferred));
    return deferred.promise;
};

exports.updateGameStatus = function (gameCode, status) {
    var deferred = q.defer();
    var update = {
        status: status
    };
    if (status === "PLAYING") {
        update.gameStartTime = new Date();
        update.currentQuestion = 0;
    }
    db.collection('games').update({gameCode: gameCode}, {$set: update}, handleDbResponse(deferred));
    return deferred.promise;
};

exports.getGame = function (gameCode) {
    var deferred = q.defer();
    db.collection('games').findOne({gameCode: gameCode}, function (err, data) {
        if (err) {
            deferred.reject(false);
        } else {
            if (data === null) {
                deferred.reject(false);
            } else {
                deferred.resolve(data);
            }
        }
    });
    return deferred.promise;
};

exports.setupParticipant = function (gameCode, participantCode, teamName, isPlaying) {
    var deferred = q.defer();
    db.collection('participants').insert([
        { gameCode: gameCode,
            participantCode: participantCode,
            teamName: teamName,
            isPlaying: isPlaying}
    ], handleDbResponse(deferred));
    return deferred.promise;
};

exports.getParticipant = function (participantCode) {
    var deferred = q.defer();
    db.collection('participants').findOne({participantCode: participantCode}, handleDbResponse(deferred));
    return deferred.promise;
};

exports.getParticipants = function (gameCode) {
    var deferred = q.defer();
    db.collection('participants').find({gameCode: gameCode}, handleDbResponse(deferred));
    return deferred.promise;
};

exports.saveAnswer = function (participantCode, gameCode, questionNumber, answer, score, possibleScore) {
    var deferred = q.defer();
    var query = {
        participantCode: participantCode,
        questionNumber: questionNumber,
        gameCode: gameCode
    };
    db.collection('responses').findAndModify( {
      query: query,
      update: {
        participantCode: participantCode,
        questionNumber: questionNumber,
        gameCode: gameCode,
        answer: answer,
        score: score,
        possibleScore: possibleScore
      },
      new: true,
      upsert: true

    }, handleDbResponse(deferred));
    return deferred.promise;
};

exports.getResponse = function (participantCode, questionNumber) {
    var deferred = q.defer();
    var query = {
        participantCode: participantCode,
        questionNumber: parseInt(questionNumber)
    };
    db.collection('responses').findOne(query, handleDbResponse(deferred));
    return deferred.promise;
};

exports.getResponses = function (participantCode) {
    var deferred = q.defer();
    db.collection('responses').find({participantCode: participantCode}, handleDbResponse(deferred));
    return deferred.promise;
};

exports.getParticipantAnswers = function (gameCode, participantCode) {
    var deferred = q.defer();
    db.collection('responses').find({gameCode: gameCode, participantCode: participantCode}, handleDbResponse(deferred));
    return deferred.promise;
};

exports.getParticipantsWithScores = function (gameCode) {
    var deferred = q.defer();
    db.collection('responses').aggregate([
        {
            $match: {
                gameCode: gameCode
            }
        },
        {
            $group: {
                _id: { participantCode: "$participantCode" },
                totalScore: {
                    $sum: "$score"
                }
            }
        }
    ], handleDbResponse(deferred));
    return deferred.promise;
};

exports.hasQuestion = function (category, question) {
    var deferred = q.defer();
    db.collection('questions').findOne({category: category, question: question}, handleDbResponse(deferred))
    return deferred.promise.then(function (data) {
        return data != null;
    });
};

exports.addNewQuestion = function (newQuestion) {
    var status = question.validateNewQuestion(newQuestion);
    if (status !== "") {
        var deferred = q.defer();
        deferred.resolve("ERROR: " + status);
        return deferred.promise;
    }
    return exports.hasQuestion(newQuestion.category, newQuestion.question).then(function (hasQuestion) {
        if (hasQuestion) {
            return "ERROR: Question already exists-> Category:" + newQuestion.category + ", Question: " + newQuestion.question;
        } else {
            var deferred = q.defer();
            newQuestion.timeStamp = process.hrtime();
            db.collection('questions').insert([newQuestion], handleDbResponse(deferred));
            return deferred.promise.then(function (result) {
                return "OK";
            })
        }
    })
};

exports.getAllQuestionGroups = function() {
  var deferred = q.defer();
  db.collection('questions').distinct('category', handleDbResponse(deferred));
  return deferred.promise;
};

exports.getGroupSize = function(group) {
  var deferred = q.defer();
  db.collection('questions').count({category: group}, handleDbResponse(deferred));
  return deferred.promise;
};

exports.getQuestion = function(groupName, questionNumber) {
  var deferred = q.defer();
  db.collection('questions').find({category: groupName}).sort({timeStamp: 1}, handleDbResponse(deferred));
  return deferred.promise.then(function(questionData) {
    return questionData[questionNumber];
  });
};