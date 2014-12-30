var express = require('express');
var dbService = require('../app/service/db');
var router = express.Router();

router.get('/allUsers', function (request, response) {
    dbService.getAllUsers()
        .then(function (users) {
            response.json(users); });
});

router.get('/bigDummy', function (request, response) {
   response.json({name: "Matt Bair", dummyLevel: 4,
   defcon: 5});
});


module.exports = router;
