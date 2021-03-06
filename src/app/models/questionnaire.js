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
    idClass: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        required: true,
    },
    commentary: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    startDate: {
        type: Date,
    },
    finalDate: {
        type: Date,
    },
    updateDate: {
        type: Date,
    }
})

questionnaireSchema.pre('save', async function (next) {
    const questionnaire = this
    next()
})

const Questionnaire = mongoose.model('Questionnaire', questionnaireSchema)

module.exports = Questionnaire;