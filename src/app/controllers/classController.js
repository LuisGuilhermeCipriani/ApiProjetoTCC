const express = require('express');

const Class = require('../models/class');
const User = require('../models/user');

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { students, idProfessor, idDiscipline, period, code } = req.body;

        if(await Class.findOne({ idProfessor, idDiscipline, period, code })) {
            return res.status(400).send({ error: 'Turma já existente!' });
        }

        const objectClass = await Class.create({ students, idProfessor, idDiscipline, period, code });

        await objectClass.save();
        return res.status(201).send({ objectClass });
    } catch (err) {
        res.status(400).send({ error: 'Erro ao registrar turma!' })
    }
});

router.get('/findAll', async (req, res) => {
    try {
        const classes = await Class.find({ }).populate('students');

        return res.send({ classes });
    } catch (err) {
        res.status(400).send({ error: 'Erro ao consultar turma!' })
    }
});

router.post('/findById', async (req, res) => {
    try {
        const { idClass } = req.body;
        const classes = await Class.findById({ _id:idClass })

        return res.send(classes);
    } catch (err) {
        res.status(400).send({ error: 'Erro ao consultar turmas!' })
    }
});

router.post('/findByIdUser', async (req, res) => {
    try {
        const { idUser, active } = req.body;
        let classes;
        const user = await User.findById({ _id: idUser });
        if (user.type === 'P') {
            classes = await Class.find({ idProfessor: idUser, active }).populate(['idDiscipline', 'idProfessor']);
        } else if (user.type === 'S') {
            classes = await Class.find({ students: { _id: idUser }, active }).populate(['idDiscipline', 'idProfessor'])
        }

        return res.send({ classes });
    } catch (err) {
        res.status(400).send({ error: 'Erro ao consultar turmas!' })
    }
});

module.exports = app => app.use('/class', router);