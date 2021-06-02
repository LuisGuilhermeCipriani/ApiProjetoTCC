const express = require('express');

const QuestionAnswer = require('../models/questionAnswer');
const Questionnaire = require('../models/questionnaire');

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { questionAnswer, status, idDiscipline, idStudent, idProfessor } = req.body;

        if(await Questionnaire.findOne({ status, idDiscipline, idStudent, idProfessor })) {
            return res.status(400).send({ error: 'Questionário já existente!' });
        }

        const questionnaire = await Questionnaire.create({ status, idDiscipline, idStudent, idProfessor });

        await Promise.all(questionAnswer.map(async questionAnswer => {
            const resQuestionAnswer = new QuestionAnswer({ ...questionAnswer, idQuestionnaire: questionnaire._id });
            await resQuestionAnswer.save();
            questionnaire.questionAnswer.push(resQuestionAnswer);
        }));

        await questionnaire.save();
        return res.status(201).send({ questionnaire });
    } catch (err) {
        res.status(400).send({ error: 'Erro ao registrar questionário!' + err })
    }
});

router.post('/findAll', async (req, res) => {
    try {
        const { idStudent } = req.body;
        const questionnaires = await Questionnaire.find({ idStudent });

        return res.send({ questionnaires });
    } catch (err) {
        res.status(400).send({ error: 'Erro ao consultar questionário!' })
    }
});

router.put('/update', async (req, res) => {
    try {
        const { idQuestionnaire, questionAnswer } = req.body;
        const object = await Questionnaire.findByIdAndUpdate( idQuestionnaire, {status: 'S'}, { new: true });

        object.questionAnswer = [];
        await QuestionAnswer.remove({ idQuestionnaire: idQuestionnaire });

        await Promise.all(questionAnswer.map(async objectQuestionAnswer => {
            const questionnaireQuestionAnswer = new QuestionAnswer({ ...objectQuestionAnswer, idQuestionnaire: object._id });
            await questionnaireQuestionAnswer.save();
            object.questionAnswer.push(questionnaireQuestionAnswer);
        }));

        await object.save();
        return res.status(201).send({ questionnaire: object });
    } catch (err) {
        res.status(400).send({ error: 'Erro ao atualizar questionario!' + err })
    }
});


router.post('/findByIdDisciplineUser', async (req, res) => {
    try {
        const { disciplineUser, status } = req.body;
        const questionnaires = await Questionnaire.findOne({ disciplineUser, status }).populate(['questionAnswer', 'disciplineUser']);

        return res.send({ questionnaires });
    } catch (err) {
        res.status(400).send({ error: 'Erro ao consultar questionário!' })
    }
});

module.exports = app => app.use('/questionnaire', router);