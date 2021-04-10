const express = require('express');

const User = require('../models/user');
const Quiz = require('../models/quiz');

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { items, details, detailsNfce } = req.body.nfce;
        const { accesskey } = detailsNfce;

        if(await Nfce.findOne({ accesskey, user: req.userId })) {
            return res.status(400).send({ error: 'NFC-e já existente!' });
        }

        const nfce = await Nfce.create({ user: req.userId, ...details, ...detailsNfce });
        console.log('NFCE: ', nfce)

        await Promise.all(items.map(async item => {
            const nfceItem = new Item({ ...item, nfce: nfce._id });
            await nfceItem.save();
            nfce.items.push(nfceItem);
        }));

        await nfce.save();
        return res.status(201).send({ nfce });
    } catch (err) {
        res.status(400).send({ error: 'Erro ao registrar NFC-e!' })
    }
});

module.exports = app => app.use('/quiz', router);