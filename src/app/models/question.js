const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
    },
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        require: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

QuestionSchema.pre('save', async function(next) {
    next();
});

const Question = mongoose.model('Question', QuestionSchema);

module.exports = Question;