const mongoose = require('mongoose');

const DisciplineUserSchema = new mongoose.Schema({
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
    createdAt: {
        type: Date,
        default: Date.now
    },
});

DisciplineUserSchema.pre('save', async function(next) {
    next();
});

const DisciplineUser = mongoose.model('DisciplineUser', DisciplineUserSchema);

module.exports = DisciplineUser;