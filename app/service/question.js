var xlsx = require('xlsx');

exports.validateNewQuestion = function (newQuestion) {
    var errors = "";
    if (newQuestion.question == null || newQuestion.question.length < 5)
        errors = "Question is not valid.  ";
    if (newQuestion.category == null)
        errors += "Category is not valid.  ";
    if (newQuestion.answers == null || newQuestion.answers.length != 4) {
        errors += "There must be exactly 4 answers.";
    } else {
        for (var i = 0; i < 4; i++) {
            if (newQuestion.answers[i] === null || newQuestion.answers[i].length < 1)
                errors += "Answer " + i + " is not valid.  ";
        }
    }
    if(newQuestion.correctAnswer == null || newQuestion.correctAnswer < 0 || newQuestion.correctAnswer > 3)
        errors += "CorrectAnswer is not valid.  ";
    return errors;
};

exports.getQuestionsFromExcelFile = function(pathToExcelFile) {
    var workbook = xlsx.readFile(pathToExcelFile);
    var firstSheet = workbook.Sheets[0];
    return {csv: xlsx.utils.sheet_to_json(workbook.Sheets['Sheet1'])};
}