const mongoose = require('mongoose')

const questionnaireSchema = mongoose.Schema({
    questionAnswer: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'QuestionAnswer'
      }],
    status: {
        type: String,
        default: 'N'
    },
    idDiscipline: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Discipline',
        required: true,
    },
    idStudent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    idProfessor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

questionnaireSchema.pre('save', async function (next) {
    const questionnaire = this
    next()
})

const Questionnaire = mongoose.model('Questionnaire', questionnaireSchema)

module.exports = Questionnaire;