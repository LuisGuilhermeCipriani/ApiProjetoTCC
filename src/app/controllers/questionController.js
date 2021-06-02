const express = require('express');

const Question = require('../models/question');

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { title, option } = req.body;

        if(await Question.findOne({ title })) {
            return res.status(400).send({ error: 'Pergunta já existente!' });
        }

        const question = await Question.create({ title, option });

        await question.save();
        return res.status(201).send({ question });
    } catch (err) {
        res.status(400).send({ error: 'Erro ao registrar pergunta!' })
    }
});

router.get('/findAll', async (req, res) => {
    try {
        const questions = await Question.find();

        return res.send({ questions });
    } catch (err) {
        res.status(400).send({ error: 'Erro ao consultar pergunta!' })
    }
});

module.exports = app => app.use('/question', router);