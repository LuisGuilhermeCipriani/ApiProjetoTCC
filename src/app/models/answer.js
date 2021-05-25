const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
    },
    option:{
        type: Number,
        require: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

AnswerSchema.pre('save', async function(next) {
    next();
});

const Answer = mongoose.model('Answer', AnswerSchema);

module.exports = Answer;