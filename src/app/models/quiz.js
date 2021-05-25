const mongoose = require('mongoose')

const quizSchema = mongoose.Schema({
    disciplineUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DisciplineUser',
        require: true
    },
    questionAnswer: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'QuestionAnswer'
      }],
    status: {
        type: String,
        default: 'N'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

quizSchema.pre('save', async function (next) {
    const quiz = this
    next()
})

const Quiz = mongoose.model('Quiz', quizSchema)

module.exports = Quiz;