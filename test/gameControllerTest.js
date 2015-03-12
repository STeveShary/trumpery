var chai = require("chai");
var sinon = require("sinon");
var gameController = require("../app/controller/gameController");
var constants = require("../app/constants");

sinon.assert.expose(chai.assert, { prefix: "" });
var expect = chai.expect;
var clock;


describe('GameController', function () {
  beforeEach(function(){
    this.clock = sinon.useFakeTimers();
  });

  afterEach(function(){
    this.clock.restore();
  });


  describe('calculateGameStatus', function () {

    it("should return the status of 'NOT_STARTED' when game hasn't started", function (done) {
      var game = {status: "NOT_STARTED"};
      gameController.calculateGameStatus(game).then(function(gameStatus) {
        expect(gameStatus.status).to.equal("NOT_STARTED");
        done();
      });
    });

    it("should return the status of 'COUNTDOWN' when the game has started one second ago.", function(done) {
      var timeAfterStart = 1000;
      var game = {status: "STARTED", gameStartTime: new Date() - timeAfterStart};
      gameController.calculateGameStatus(game).then(function(gameStatus) {
        expect(gameStatus.status).to.equal("COUNTDOWN");
        expect(gameStatus.countdownTime).to.equal(constants.COUNTDOWN_TIME_BEFORE_GAME - timeAfterStart);
        done();
      });
    });

    it("should return the status of 'GAME_ENDED' when the game has finished.", function(done) {
      var game = {status: "STARTED",
        gameStartTime: new Date() - (constants.COUNTDOWN_TIME_BEFORE_GAME + constants.numberOfQuestions * constants.TIME_PER_QUESTION)};
      gameController.calculateGameStatus(game).then(function(gameStatus) {
        expect(gameStatus.status).to.equal("GAME_ENDED");
        done();
      });
    });

    it("should return the status of 'ANSWERING_QUESTION' for the first question when I am at the start of the first question.", function() {
      var game = {status: "STARTED",
                  gameStartTime: new Date() - constants.COUNTDOWN_TIME_BEFORE_GAME};
      gameController.calculateGameStatus(game).then(function(gameStatus) {
        expect(gameStatus.status).to.equal("ANSWERING_QUESTION");
        expect(gameStatus.questionNumber).to.equal(0);
        expect(gameStatus.questionText).to.equal(constants.questions[0].question);
        expect(gameStatus.answerOptions).to.equal(constants.questions[0].answers);
        expect(gameStatus.elapsedSeconds).to.equal(0);
        expect(gameStatus.timeLimit).to.equal(constants.TIME_TO_ANSWER_QUESTION);
        expect(gameStatus.gracePeriod).to.equal(constants.TIME_TO_READ_QUESTION);
        expect(gameStatus.numberOfQuestions).to.equal(constants.questions.length);
        done();
      });
    });

    it("should return the status of 'ANSWERING_QUESTION' for the first question when I am 2 seconds after the start of the first question.", function() {
      var game = {status: "STARTED",
        gameStartTime: new Date() - (constants.COUNTDOWN_TIME_BEFORE_GAME + 2000)};
      gameController.calculateGameStatus(game).then(function(gameStatus) {
        expect(gameStatus.status).to.equal("ANSWERING_QUESTION");
        expect(gameStatus.questionNumber).to.equal(0);
        expect(gameStatus.questionText).to.equal(constants.questions[0].question);
        expect(gameStatus.answerOptions).to.equal(constants.questions[0].answers);
        expect(gameStatus.elapsedSeconds).to.equal(2000);
        expect(gameStatus.timeLimit).to.equal(constants.TIME_TO_ANSWER_QUESTION);
        expect(gameStatus.gracePeriod).to.equal(constants.TIME_TO_READ_QUESTION);
        done();
      });
    });

    it("should return the status of 'WAITING_FOR_NEXT_QUESTION' when there is no more time to answer the current question.", function() {
      var game = {status: "STARTED",
                  gameStartTime: new Date() - (constants.COUNTDOWN_TIME_BEFORE_GAME + constants.TIME_TO_READ_QUESTION + constants.TIME_TO_ANSWER_QUESTION)};
      gameController.calculateGameStatus(game).then(function(gameStatus) {
        expect(gameStatus.status).to.equal("SHOWING_ANSWER_FOR_CURRENT_QUESTION");
        expect(gameStatus.questionNumber).to.equal(0);
        expect(gameStatus.timeTillNextQuestion).to.equal(constants.TIME_TILL_NEXT_QUESTION);
        done();
      })
    });

    it("should return the status of 'WAITING_FOR_NEXT_QUESTION' when we are 2 seconds past the final time  to answer the current question.", function() {
      var game = {status: "STARTED",
        gameStartTime: new Date() - (constants.COUNTDOWN_TIME_BEFORE_GAME + constants.TIME_TO_READ_QUESTION + constants.TIME_TO_ANSWER_QUESTION + 2000)};
      gameController.calculateGameStatus(game).then(function(gameStatus) {
        expect(gameStatus.status).to.equal("SHOWING_ANSWER_FOR_CURRENT_QUESTION");
        expect(gameStatus.questionNumber).to.equal(0);
        expect(gameStatus.timeTillNextQuestion).to.equal(constants.TIME_TILL_NEXT_QUESTION - 2000);
        done();
      });
    });

    it("should return the status of 'ANSWERING_QUESTION' with second question information at the full end of the first question.", function() {
      var game = {status: "STARTED",
        gameStartTime: new Date() - (constants.COUNTDOWN_TIME_BEFORE_GAME + constants.TIME_PER_QUESTION)};
      gameController.calculateGameStatus(game).then(function(gameStatus) {
        expect(gameStatus.status).to.equal("ANSWERING_QUESTION");
        expect(gameStatus.questionNumber).to.equal(1);
        expect(gameStatus.questionText).to.equal(constants.questions[1].question);
        expect(gameStatus.answerOptions).to.equal(constants.questions[1].answers);
        expect(gameStatus.elapsedSeconds).to.equal(0);
        expect(gameStatus.timeLimit).to.equal(constants.TIME_TO_ANSWER_QUESTION);
        expect(gameStatus.gracePeriod).to.equal(constants.TIME_TO_READ_QUESTION);
        done();
      });
    });
  });
});
