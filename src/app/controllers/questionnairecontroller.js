const express = require('express');

const QuestionAnswer = require('../models/questionAnswer');
const Questionnaire = require('../models/questionnaire');
const Class = require('../models/class');
const Question = require('../models/question');

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { status, idDiscipline, idStudent, idProfessor, idClass } = req.body;

        if(await Questionnaire.findOne({ status, idDiscipline, idStudent, idProfessor, idClass })) {
            return res.status(400).send({ error: 'Questionário já existente!' });
        }

        const questionnaire = await Questionnaire.create({ status, idDiscipline, idStudent, idProfessor, idClass });

        const questions = await Question.find();

        await Promise.all(questions.map(async idQuestion => {
            const resQuestionAnswer = new QuestionAnswer({ idQuestion: idQuestion._id, idQuestionnaire: questionnaire._id });
            await resQuestionAnswer.save();
            questionnaire.questionAnswer.push(resQuestionAnswer);
        }));

        await questionnaire.save();
        return res.status(201).send({ questionnaire });
    } catch (err) {
        res.status(400).send({ error: 'Erro ao registrar questionário!' + err })
    }
});

router.post('/findAllByIdStudent', async (req, res) => {
    try {
        const { idStudent } = req.body;
        const questionnaires = await Questionnaire.find({ idStudent });

        return res.send({ questionnaires });
    } catch (err) {
        res.status(400).send({ error: 'Erro ao consultar questionário!' })
    }
});

router.post('/findAll', async (req, res) => {
    try {
        const { status } = req.body;
        const questionnaires = await Questionnaire.find({ status });

        return res.send({ questionnaires });
    } catch (err) {
        res.status(400).send({ error: 'Erro ao consultar questionário!' })
    }
});

router.post('/findAllByPeriodFinished', async (req, res) => {
    try {
        const { idStudent, period } = req.body;
        const questionnaires = await Questionnaire.find({ idStudent, status: 'S'})
        .populate(["idDiscipline", "idProfessor", "idStudent", "idClass", "questionAnswer"])
        const questionnairesByPeriod = await questionnaires.filter(async object => (
            await Class.findOne({_id: object.idClass, period})
        ))

        return res.send({ questionnairesByPeriod });
    } catch (err) {
        res.status(400).send({ error: 'Erro ao consultar questionário!' })
    }
});

router.post('/findAllByPeriod', async (req, res) => {
    try {
        const { idStudent, period } = req.body;
        const questionnaires = await Questionnaire.find({ idStudent, $or:[ {'status':'N'}, {'status':'I'} ]})
        .populate(["idDiscipline", "idProfessor", "idStudent", "idClass", "questionAnswer"])
        const questionnairesByPeriod = await questionnaires.filter(async object => (
            await Class.findOne({_id: object.idClass, period})
        ))

        return res.send({ questionnairesByPeriod });
    } catch (err) {
        res.status(400).send({ error: 'Erro ao consultar questionário!' })
    }
});

router.put('/update', async (req, res) => {
    try {
        const { idQuestionnaire, questionAnswer, commentary, status } = req.body;
        const object = await Questionnaire.findByIdAndUpdate( idQuestionnaire, {status, commentary}, { new: true });

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
        res.status(400).send({ error: 'Erro ao atualizar questionario! ' + err })
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

router.post('/findByIdProfessor', async (req, res) => {
    try{
        const { idProfessor, period } = req.body;
        const classList = await Class.find({idProfessor, period})
        
        const list = await Promise.all(classList.map(async object => {
            const questionnaire = await Questionnaire.find({idClass: object._id, status: 'S'})
            .populate(['questionAnswer', 'idDiscipline', 'idStudent', 'idProfessor', 'idClass'])

            if(questionnaire.length > 0) {
                return questionnaire;
            }
        }))

        const filteredList = list.filter(object => object != null)

        return res.send({questionnaires: filteredList});
    } catch (err) {
        res.status(400).send({ error: 'Erro ao consultar questionários!'})
    }
});

module.exports = app => app.use('/questionnaire', router);