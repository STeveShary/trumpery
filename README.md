Trumpery
========

A bar-trivia game that allows multiple people to join a game and play in real-time.

Prerequisites
-----------
To run trumpery, you need

 - Docker: Version 1.11 (or higher)

Running the game server.
-----------
 1. Setup the database.  Setup the trumpery user. 
   `mongo admin --eval "db.getSiblingDB('trumpery').createUser({user: 'trumpery', pwd: 'trumpery', roles: ['dbAdmin', 'readWrite']})"`
   
 2. Install the node packages:  From the trumpery directory, run: `npm install`
 3. You can startup the application with: `./run.sh`
 
 **All Finished!**  The web server will be running on port 3000.   
   
Development
------------

To build the application (front and backend):

1.  Run `build.sh`

There is also a `clean.sh` to properly clean the `node_modules` directory and the `client/dist` folder as well.
To run this in development mode:

1. Just like running the game, you need to install the needed npm modules using the command `npm install`
2. run `npm-install -g gulp`
3. run `gulp develop` to launch nodemon, a live mocha test runner and to load all of the JS as a single, minified resource.

Tuning
------------
The following tuning scripts can improve performance on Mongo. Caveat Emptor!

`mongo trumpery -u trumpery -p trumpery --eval "db.questions.createIndex({category: 1});"`
`mongo trumpery -u trumpery -p trumpery --eval "db.responses.createIndex({gameCode: 1, participantCode: -1, questionNumber: -2});"`
`mongo trumpery -u trumpery -p trumpery --eval "db.questions.createIndex({gameCode: 1, participantCode: -1, questionNumber: -2});"`