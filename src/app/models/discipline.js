const mongoose = require('mongoose');

const DisciplineSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
    },
    code: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

DisciplineSchema.pre('save', async function(next) {
    next();
});

const Discipline = mongoose.model('Discipline', DisciplineSchema);

module.exports = Discipline;