const express = require('express');

const Question = require('../models/question');
const Answer = require('../models/answer');
const Question_Answer = require('../models/question_answer');

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { idQuestion, idAnswer } = req.body;

        if(await Question_Answer.findOne({ idQuestion, idAnswer })) {
            return res.status(400).send({ error: 'Pergunta/Resposta já existente!' });
        }

        const question_Answer = await Question_Answer.create({ idQuestion, idAnswer });

        await question_Answer.save();
        return res.status(201).send({ question_Answer });
    } catch (err) {
        res.status(400).send({ error: 'Erro ao registrar pergunta/resposta!' })
    }
});

router.get('/findAll', async (req, res) => {
    try {
        const question_Answer = await Question_Answer.find();

        return res.send({ question_Answer });
    } catch (err) {
        res.status(400).send({ error: 'Erro ao consultar pergunta/resposta!' })
    }
});

module.exports = app => app.use('/question_Answer', router);