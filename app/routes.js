var express = require('express');
var dbService = require('../app/service/db');
var router = express.Router();

router.get('/allUsers', function (request, response) {
    dbService.getAllUsers()
        .then(function (users) {
            response.json(users);
        });
});

module.exports = router;
