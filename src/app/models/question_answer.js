const mongoose = require('mongoose');

const QuestionAnswerSchema = new mongoose.Schema({
    idQuestion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        require: true
    },
    idAnswer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Answer',
        require: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

QuestionAnswerSchema.pre('save', async function(next) {
    next();
});

const QuestionAnswer = mongoose.model('QuestionAnswer', QuestionAnswerSchema);

module.exports = QuestionAnswer;