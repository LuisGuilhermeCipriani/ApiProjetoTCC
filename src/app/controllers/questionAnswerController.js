const express = require('express');

const Question = require('../models/question');
const Answer = require('../models/answer');
const QuestionAnswer = require('../models/questionAnswer');

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { idQuestion, idAnswer} = req.body;

        const objectQuestionAnswer = await QuestionAnswer.findOne({ idQuestion, idAnswer })
        if(objectQuestionAnswer) {
            return res.status(201).send({ objectQuestionAnswer });
        }

        const questionAnswer = await QuestionAnswer.create({ idQuestion, idAnswer });

        await questionAnswer.save();
        return res.status(201).send({ questionAnswer });
    } catch (err) {
        res.status(400).send({ error: 'Erro ao registrar pergunta/resposta!' })
    }
});

router.get('/findAll', async (req, res) => {
    try {
        const questionAnswer = await QuestionAnswer.find();

        return res.send({ questionAnswer });
    } catch (err) {
        res.status(400).send({ error: 'Erro ao consultar pergunta/resposta!' })
    }
});

module.exports = app => app.use('/questionAnswer', router);