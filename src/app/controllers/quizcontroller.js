const express = require('express');

const DisciplineUser = require('../models/disciplineUser');
const QuestionAnswer = require('../models/questionAnswer');
const Quiz = require('../models/quiz');

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { disciplineUser, questionAnswer, status } = req.body;

        if(await Quiz.findOne({ disciplineUser, status })) {
            return res.status(400).send({ error: 'Questionário já existente!' });
        }

        const quiz = await Quiz.create({ disciplineUser, status });

        await Promise.all(questionAnswer.map(async questionAnswer => {
            const resQuestionAnswer = new QuestionAnswer({ ...questionAnswer, quiz: quiz._id });
            await resQuestionAnswer.save();
            quiz.questionAnswer.push(resQuestionAnswer);
        }));

        await quiz.save();
        return res.status(201).send({ quiz });
    } catch (err) {
        res.status(400).send({ error: 'Erro ao registrar questionário!' + err })
    }
});

router.post('/findAll', async (req, res) => {
    try {
        const { idUser, status } = req.body;
        const disciplineUser = await DisciplineUser.findOne({ idUser });
        const quizzes = await Quiz.findOne({ disciplineUser, status }).populate(['questionAnswer', 'disciplineUser']);

        return res.send({ quizzes });
    } catch (err) {
        res.status(400).send({ error: 'Erro ao consultar questionário!' })
    }
});

router.post('/findByIdDisciplineUser', async (req, res) => {
    try {
        const { disciplineUser, status } = req.body;
        const quizzes = await Quiz.findOne({ disciplineUser, status }).populate(['questionAnswer', 'disciplineUser']);

        return res.send({ quizzes });
    } catch (err) {
        res.status(400).send({ error: 'Erro ao consultar questionário!' })
    }
});

module.exports = app => app.use('/quiz', router);