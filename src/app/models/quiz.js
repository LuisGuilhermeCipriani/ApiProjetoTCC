const mongoose = require('mongoose')

const quizSchema = mongoose.Schema({
    discipline: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Discipline',
        require: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        require: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String
    }
})

quizSchema.pre('save', async function (next) {
    const quiz = this
    next()
})

const Quiz = mongoose.model('Quiz', quizSchema)

module.exports = Quiz;