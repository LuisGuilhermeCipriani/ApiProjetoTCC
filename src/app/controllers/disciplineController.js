const express = require('express');

const Discipline = require('../models/discipline');

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { title, code } = req.body;

        if(await Discipline.findOne({ code })) {
            return res.status(400).send({ error: 'Disciplina já existente!' });
        }

        const discipline = await Discipline.create({ title, code });

        await discipline.save();
        return res.status(201).send({ discipline });
    } catch (err) {
        res.status(400).send({ error: 'Erro ao registrar disciplina!' })
    }
});

router.get('/findAll', async (req, res) => {
    try {
        const disciplines = await Discipline.find({ }).populate('idUser');

        return res.send({ disciplines });
    } catch (err) {
        res.status(400).send({ error: 'Erro ao consultar disciplina!' })
    }
});

router.post('/findById', async (req, res) => {
    try {
        const { idDiscipline } = req.body;
        const disciplines = await Discipline.findById({ _id:idDiscipline })

        return res.send(disciplines);
    } catch (err) {
        res.status(400).send({ error: 'Erro ao consultar disciplinas!' })
    }
});

module.exports = app => app.use('/discipline', router);