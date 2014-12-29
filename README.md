trumpery
========

A bar-trivia game.

Database setup
----------
After installing mongo, run the following command to setup the database and user:
`use trumpery
`db.createUser( { 'user': 'trumpery', 'pwd': 'trumpery', 'roles': ['readWrite']});


Development
------------
To run this in development mode:
1. run `npm install -g nodemon`
2. run `nodemon ./bin/www`
