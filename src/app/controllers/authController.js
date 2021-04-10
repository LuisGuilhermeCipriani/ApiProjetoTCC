const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
//const jwt = require('jsonwebtoken');

//const authConfig = require('../../config/auth.json');



const router = express.Router();

/*function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400,
    });
}*/

router.post('/register', async (req, res) => {
    console.log("Cheguei");
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

module.exports = app => app.use('/auth', router);