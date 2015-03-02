Trumpery
========

A bar-trivia game that allows multiple people to join a game and play in real-time.

Prerequisites
-----------
To run trumpery, you need

 - Node.js installed and on the path.
 - MongoDB 2.6 or higher.

Running the game server.
-----------
 1. Setup the database.  Setup the trumpery user. 
   `mongo --eval "db.createUser( { 'user': 'trumpery', 'pwd': 'trumpery', 'roles': ['readWrite']});"`
   
 2. Install the node packages:  From the trumpery directory, run: `npm install`
 3. You can startup the application with: `./run.sh`
 
 **All Finished!**  The web server will be running on port 3000.   
   
Development
------------
To run this in development mode:

1. run `npm install -g nodemon`
2. run `nodemon ./bin/www`

   OR

1. run `npm-install -g gulp`
2. run `gulp develop` to launch nodemon, a live mocha test runner and to load all of the JS as a single, minified resource.