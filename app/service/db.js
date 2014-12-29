// setup the database.
var mongo = require('mongoskin');
var db = mongo.db("mongodb://trumpery:trumpery@localhost:27017/trumpery", {native_parser:true});
var q = require('q');

exports.getAllUsers = function() {
    var deferred = q.defer();
    db.collection('users').find().toArray(function (err, users) {
        if(err) {
            deferred.reject(err);
        } else {
            deferred.resolve(users);
        }
    });
    return deferred.promise;
};