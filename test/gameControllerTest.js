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

    it("should return the status of 'NOT_STARTED' when game hasn't started", function () {
      var game = {status: "NOT_STARTED"};
      expect(gameController.calculateGameStatus(game).status).to.equal("NOT_STARTED");
    });

    it("should return the status of 'COUNTDOWN' when the game has started one second ago.", function() {
      var timeAfterStart = 1000;
      var game = {status: "STARTED", gameStartTime: new Date() - timeAfterStart};
      expect(gameController.calculateGameStatus(game).status).to.equal("COUNTDOWN");
      expect(gameController.calculateGameStatus(game).countdownTime).to.equal(constants.COUNTDOWN_TIME_BEFORE_GAME - timeAfterStart);
    });

    it("should return the status of 'GAME_ENDED' when the game has finished.", function() {
      var game = {status: "STARTED",
        gameStartTime: new Date() - (constants.COUNTDOWN_TIME_BEFORE_GAME + constants.numberOfQuestions * constants.TIME_PER_QUESTION)};
      expect(gameController.calculateGameStatus(game).status).to.equal("GAME_ENDED");
    });

    it("should return the status of 'ANSWERING_QUESTION' for the first question when I am at the start of the first question.", function() {
      var game = {status: "STARTED",
                  gameStartTime: new Date() - constants.COUNTDOWN_TIME_BEFORE_GAME};
      expect(gameController.calculateGameStatus(game).status).to.equal("ANSWERING_QUESTION");
      expect(gameController.calculateGameStatus(game).questionNumber).to.equal(0);
      expect(gameController.calculateGameStatus(game).questionText).to.equal(constants.questions[0].question);
      expect(gameController.calculateGameStatus(game).answerOptions).to.equal(constants.questions[0].answers);
      expect(gameController.calculateGameStatus(game).elapsedSeconds).to.equal(0);
      expect(gameController.calculateGameStatus(game).timeLimit).to.equal(constants.TIME_TO_ANSWER_QUESTION);
      expect(gameController.calculateGameStatus(game).gracePeriod).to.equal(constants.TIME_TO_READ_QUESTION);
      expect(gameController.calculateGameStatus(game).numberOfQuestions).to.equal(constants.questions.length);
    });

    it("should return the status of 'ANSWERING_QUESTION' for the first question when I am 2 seconds after the start of the first question.", function() {
      var game = {status: "STARTED",
        gameStartTime: new Date() - (constants.COUNTDOWN_TIME_BEFORE_GAME + 2000)};
      expect(gameController.calculateGameStatus(game).status).to.equal("ANSWERING_QUESTION");
      expect(gameController.calculateGameStatus(game).questionNumber).to.equal(0);
      expect(gameController.calculateGameStatus(game).questionText).to.equal(constants.questions[0].question);
      expect(gameController.calculateGameStatus(game).answerOptions).to.equal(constants.questions[0].answers);
      expect(gameController.calculateGameStatus(game).elapsedSeconds).to.equal(2000);
      expect(gameController.calculateGameStatus(game).timeLimit).to.equal(constants.TIME_TO_ANSWER_QUESTION);
      expect(gameController.calculateGameStatus(game).gracePeriod).to.equal(constants.TIME_TO_READ_QUESTION);
    });

    it("should return the status of 'WAITING_FOR_NEXT_QUESTION' when there is no more time to answer the current question.", function() {
      var game = {status: "STARTED",
                  gameStartTime: new Date() - (constants.COUNTDOWN_TIME_BEFORE_GAME + constants.TIME_TO_READ_QUESTION + constants.TIME_TO_ANSWER_QUESTION)};
      expect(gameController.calculateGameStatus(game).status).to.equal("SHOWING_ANSWER_FOR_CURRENT_QUESTION");
      expect(gameController.calculateGameStatus(game).questionNumber).to.equal(0);
      expect(gameController.calculateGameStatus(game).timeTillNextQuestion).to.equal(constants.TIME_TILL_NEXT_QUESTION);
    });

    it("should return the status of 'WAITING_FOR_NEXT_QUESTION' when we are 2 seconds past the final time  to answer the current question.", function() {
      var game = {status: "STARTED",
        gameStartTime: new Date() - (constants.COUNTDOWN_TIME_BEFORE_GAME + constants.TIME_TO_READ_QUESTION + constants.TIME_TO_ANSWER_QUESTION + 2000)};
      expect(gameController.calculateGameStatus(game).status).to.equal("SHOWING_ANSWER_FOR_CURRENT_QUESTION");
      expect(gameController.calculateGameStatus(game).questionNumber).to.equal(0);
      expect(gameController.calculateGameStatus(game).timeTillNextQuestion).to.equal(constants.TIME_TILL_NEXT_QUESTION - 2000);
    });

    it("should return the status of 'ANSWERING_QUESTION' with second question information at the full end of the first question.", function() {
      var game = {status: "STARTED",
        gameStartTime: new Date() - (constants.COUNTDOWN_TIME_BEFORE_GAME + constants.TIME_PER_QUESTION)};
      expect(gameController.calculateGameStatus(game).status).to.equal("ANSWERING_QUESTION");
      expect(gameController.calculateGameStatus(game).questionNumber).to.equal(1);
      expect(gameController.calculateGameStatus(game).questionText).to.equal(constants.questions[1].question);
      expect(gameController.calculateGameStatus(game).answerOptions).to.equal(constants.questions[1].answers);
      expect(gameController.calculateGameStatus(game).elapsedSeconds).to.equal(0);
      expect(gameController.calculateGameStatus(game).timeLimit).to.equal(constants.TIME_TO_ANSWER_QUESTION);
      expect(gameController.calculateGameStatus(game).gracePeriod).to.equal(constants.TIME_TO_READ_QUESTION);
    });
  });
});
