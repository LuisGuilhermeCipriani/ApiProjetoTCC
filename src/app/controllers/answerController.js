const express = require('express');

const Answer = require('../models/answer');

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { title, option } = req.body;

        if(await Answer.findOne({ title, option })) {
            return res.status(400).send({ error: 'Resposta já existente!' });
        }

        const answer = await Answer.create({ title, option });

        await answer.save();
        return res.status(201).send({ answer });
    } catch (err) {
        res.status(400).send({ error: 'Erro ao registrar resposta!' + err})
    }
});

router.get('/findAll', async (req, res) => {
    try {
        const answers = await Answer.find();

        return res.send({ answers });
    } catch (err) {
        res.status(400).send({ error: 'Erro ao consultar resposta!' })
    }
});

module.exports = app => app.use('/answer', router);