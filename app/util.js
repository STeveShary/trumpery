var now = require("performance-now");

exports.buildGameCode = function () {
    var seed = now();
    var possible = '0123456789';
    var text = '';
    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor((seed * Math.random()) % possible.length));
    return text;
};