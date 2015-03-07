var chai = require("chai");
var question = require("../app/service/question");
var expect = chai.expect;


describe('question', function () {

    describe('validateNewQuestion', function () {

        it("should generate a validation error when the question is null", function () {
            var newQuestion =   {
                    "category": "Science",
                    "answers": ["Smell", "Taste", "Touch", "Sight"],
                    "correctAnswer": 0,
                    "answerText": "The sense of smell is closely linked with memory, probably more so than any of our other senses.  Those with full olfactory function may be able to think of smells that evoke particular memories; the scent of an orchard in blossom conjuring up recollections of a childhood picnic, for example."
                };
            expect(question.validateNewQuestion(newQuestion)).to.equal("Question is not valid.  ")
        });

        it("should generate a validation error when the quesiton is too short", function () {
            var newQuestion =   {
                "category": "category",
                "question": "1234",
                "answers": ["Smell", "Taste", "Touch", "Sight"],
                "correctAnswer": 0,
                "answerText": "The sense of smell is closely linked with memory, probably more so than any of our other senses.  Those with full olfactory function may be able to think of smells that evoke particular memories; the scent of an orchard in blossom conjuring up recollections of a childhood picnic, for example."
            };
            expect(question.validateNewQuestion(newQuestion)).to.equal("Question is not valid.  ")
        });

        it("should generate a validation error when the category is null", function () {
            var newQuestion =   {
                "question": "Science",
                "answers": ["Smell", "Taste", "Touch", "Sight"],
                "correctAnswer": 0,
                "answerText": "The sense of smell is closely linked with memory, probably more so than any of our other senses.  Those with full olfactory function may be able to think of smells that evoke particular memories; the scent of an orchard in blossom conjuring up recollections of a childhood picnic, for example."
            };
            expect(question.validateNewQuestion(newQuestion)).to.equal("Category is not valid.  ")
        });

        it("should generate a validation error when there are no answers", function () {
            var newQuestion =   {
                "question": "Science",
                "category": "category",
                "correctAnswer": 0,
                "answerText": "The sense of smell is closely linked with memory, probably more so than any of our other senses.  Those with full olfactory function may be able to think of smells that evoke particular memories; the scent of an orchard in blossom conjuring up recollections of a childhood picnic, for example."
            };
            expect(question.validateNewQuestion(newQuestion)).to.equal("There must be exactly 4 answers.")
        });

        it("should generate a validation error when there are too few answers", function () {
            var newQuestion =   {
                "question": "Science",
                "category": "category",
                "answers": ["Smell", "Taste", "Touch"],
                "correctAnswer": 0,
                "answerText": "The sense of smell is closely linked with memory, probably more so than any of our other senses.  Those with full olfactory function may be able to think of smells that evoke particular memories; the scent of an orchard in blossom conjuring up recollections of a childhood picnic, for example."
            };
            expect(question.validateNewQuestion(newQuestion)).to.equal("There must be exactly 4 answers.")
        });

        it("should generate a validation error when there are too many answers", function () {
            var newQuestion =   {
                "question": "Science",
                "category": "category",
                "answers": ["Smell", "Taste", "Touch", "perceive", "other"],
                "correctAnswer": 0,
                "answerText": "The sense of smell is closely linked with memory, probably more so than any of our other senses.  Those with full olfactory function may be able to think of smells that evoke particular memories; the scent of an orchard in blossom conjuring up recollections of a childhood picnic, for example."
            };
            expect(question.validateNewQuestion(newQuestion)).to.equal("There must be exactly 4 answers.")
        });

        it("should generate a validation error when the correct answer is null", function () {
            var newQuestion =   {
                "question": "Science",
                "category": "category",
                "answers": ["Smell", "Taste", "Touch", "perceive"],
                "answerText": "The sense of smell is closely linked with memory, probably more so than any of our other senses.  Those with full olfactory function may be able to think of smells that evoke particular memories; the scent of an orchard in blossom conjuring up recollections of a childhood picnic, for example."
            };
            expect(question.validateNewQuestion(newQuestion)).to.equal("CorrectAnswer is not valid.  ")
        });

        it("should generate a validation error when the correct answer is too small", function () {
            var newQuestion =   {
                "question": "Science",
                "category": "category",
                "answers": ["Smell", "Taste", "Touch", "perceive"],
                "correctAnswer": -1,
                "answerText": "The sense of smell is closely linked with memory, probably more so than any of our other senses.  Those with full olfactory function may be able to think of smells that evoke particular memories; the scent of an orchard in blossom conjuring up recollections of a childhood picnic, for example."
            };
            expect(question.validateNewQuestion(newQuestion)).to.equal("CorrectAnswer is not valid.  ")
        });

        it("should generate a validation error when the correct answer is too large", function () {
            var newQuestion =   {
                "question": "Science",
                "category": "category",
                "answers": ["Smell", "Taste", "Touch", "perceive"],
                "correctAnswer": -1,
                "answerText": "The sense of smell is closely linked with memory, probably more so than any of our other senses.  Those with full olfactory function may be able to think of smells that evoke particular memories; the scent of an orchard in blossom conjuring up recollections of a childhood picnic, for example."
            };
            expect(question.validateNewQuestion(newQuestion)).to.equal("CorrectAnswer is not valid.  ")
        });
    });
});