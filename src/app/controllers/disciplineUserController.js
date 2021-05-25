const express = require('express');

const Discipline = require('../models/discipline');
const User = require('../models/user');
const DisciplineUser = require('../models/disciplineUser');

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { idDiscipline, idUser } = req.body;

        if(await DisciplineUser.findOne({ idDiscipline, idUser })) {
            return res.status(400).send({ error: 'Disciplina/usuário já existente!' });
        }

        const disciplineUser = await DisciplineUser.create({ idDiscipline, idUser });

        await disciplineUser.save();
        return res.status(201).send({ disciplineUser });
    } catch (err) {
        res.status(400).send({ error: 'Erro ao registrar disciplina/usuário!' })
    }
});

router.get('/findAll', async (req, res) => {
    try {
        const disciplineUser = await DisciplineUser.find();

        return res.send({ disciplineUser });
    } catch (err) {
        res.status(400).send({ error: 'Erro ao consultar disciplina/usuário!' })
    }
});

/*router.get('/:idUser', async (req, res) => {
    try {
        const { idUser } = req.params;
        const disciplineUser = await DisciplineUser.find({ idUser });

        return res.send({ disciplineUser });
    } catch (err) {
        res.status(400).send({ error: 'Erro ao consultar disciplinas!' })
    }
});*/

router.post('/findByIdUser', async (req, res) => {
    try {
        const { idUser } = req.body;
        const disciplineUser = await DisciplineUser.find({ idUser }).populate('idDiscipline');

        return res.send({ disciplineUser });
    } catch (err) {
        res.status(400).send({ error: 'Erro ao consultar disciplinas!' })
    }
});

module.exports = app => app.use('/DisciplineUser', router);