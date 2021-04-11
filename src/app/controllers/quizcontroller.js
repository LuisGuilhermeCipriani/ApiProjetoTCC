const express = require('express');

const User = require('../models/user');
const Discipline = require('../models/discipline');
const Question = require('../models/question');
const Quiz = require('../models/quiz');

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { idUser, idDiscipline, questions } = req.body;

        if(await Quiz.findOne({ idUser, idDiscipline })) {
            return res.status(400).send({ error: 'Questionário já existente!' });
        }

        const quiz = await Quiz.create({ idUser, idDiscipline });

        await Promise.all(questions.map(async question => {
            const quizQuestion = new Question({ ...question, quiz: quiz._id });
            await quizQuestion.save();
            quiz.questions.push(quizQuestion);
        }));

        await quiz.save();
        return res.status(201).send({ quiz });
    } catch (err) {
        res.status(400).send({ error: 'Erro ao registrar Questionário!' + err })
    }
});

router.get('/findAll', async (req, res) => {
    try {
        const { idUser } = req.body;
        const quizzes = await Quiz.find({ idUser }).populate(['idUser', 'idDiscipline', 'questions']);

        return res.send({ quizzes });
    } catch (err) {
        res.status(400).send({ error: 'Erro ao consultar Questionário!' })
    }
});

module.exports = app => app.use('/quiz', router);