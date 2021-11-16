const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }],
    idProfessor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    idDiscipline: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Discipline',
        required: true,
    },
    period: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    active: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

ClassSchema.pre('save', async function(next) {
    next();
});

const Class = mongoose.model('Class', ClassSchema);

module.exports = Class;