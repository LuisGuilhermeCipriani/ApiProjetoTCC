const express = require('express');

const User = require('../models/user');
const Discipline = require('../models/discipline');
const Question_Answer = require('../models/question_answer');
const Quiz = require('../models/quiz');

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { idUser, idDiscipline, question_answer } = req.body;

        console.log(question_answer)

        if(await Quiz.findOne({ idUser, idDiscipline })) {
            return res.status(400).send({ error: 'Questionário já existente!' });
        }

        const quiz = await Quiz.create({ idUser, idDiscipline });

        await Promise.all(question_answer.map(async question_answer => {
            const quizQuestionAnswer = new Question_Answer({ ...question_answer, quiz: quiz._id });
            await quizQuestionAnswer.save();
            quiz.question_answer.push(quizQuestionAnswer);
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
        const quizzes = await Quiz.find({ idUser }).populate(['idUser', 'idDiscipline', 'question_answer']);

        return res.send({ quizzes });
    } catch (err) {
        res.status(400).send({ error: 'Erro ao consultar Questionário!' })
    }
});

module.exports = app => app.use('/quiz', router);