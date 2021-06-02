const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const router = express.Router();

router.post('/register', async (req, res) => {
    const {cpf} = req.body;
    try {
        if(await User.findOne({cpf})) {
            return res.status(400).send({error: 'Usuário já existe'});
        }

        const user = new User(req.body);
        await user.save();
        user.password = undefined;

        return res.status(201).send({ user });
    } catch(err) {
        return res.status(400).send({ error: 'Falha ao registrar' });
    }
});

router.post('/authenticate', async (req, res) => {
    const { cpf, password } = req.body;
    
    const user = await User.findOne({ cpf }).select('+password');

    if(!user) {
        return res.status(400).send({ error: 'Usuário não encontrado!' });
    }

    if(!await  bcrypt.compare(password, user.password)) {
        return res.status(400).send({ error: 'Senha Inválida!' });
    }

    user.password = undefined;

    res.send({ user});
})

router.get('/findAll', async (req, res) => {
    try {
        const users = await User.find({ });

        return res.send({ users });
    } catch (err) {
        res.status(400).send({ error: 'Erro ao consultar usuários!' })
    }
});

router.get('/findByType', async (req, res) => {
    try {
        const {type} = req.body;
        const users = await User.find({type});

        return res.send({ users });
    } catch (err) {
        res.status(400).send({ error: 'Erro ao consultar usuários!' })
    }
});

module.exports = app => app.use('/user', router);