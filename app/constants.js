exports.COUNTDOWN_TIME_BEFORE_GAME = 10 * 1000;
exports.TIME_TO_ANSWER_QUESTION = 30 * 1000;
exports.TIME_TO_READ_QUESTION = 5 * 1000;
exports.TIME_TILL_NEXT_QUESTION = 10 * 1000;
exports.MAX_SCORE = 1000;
exports.TIME_PER_QUESTION = exports.TIME_TO_ANSWER_QUESTION + exports.TIME_TO_READ_QUESTION + exports.TIME_TILL_NEXT_QUESTION;

exports.questions = [
  {
    questionText: "What is your name?",
    answerOptions: ["Sir Arthur of Camelot", "Sir Robin", "Sir Galahad", "Sir Zach"]
  },
  {
    questionText: "What is your quest?",
    answerOptions: ["To seek the holy grail", "to do stuff", "to do other stuff", "to get all the questions right"]
  },
  {
    questionText: "What is the airspeed velocity of an unladen swallow?",
    answerOptions: ["African or European swallow?", "I don't know that!", "15mph", "raggle fraggle"]
  }
];

exports.numberOfQuestions = exports.questions.length;

exports.answers = [0, 0, 2];
exports.answerText = [ "This name was used on the set.", "The quest was a rouse to show the modern imagery.", "swallows are endangered species."];
