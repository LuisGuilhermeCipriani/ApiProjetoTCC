const mongoose = require('mongoose')

const quizSchema = mongoose.Schema({
    idDiscipline: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Discipline',
        require: true
    },
    idUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
      }],
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