const express = require('express');

const Quiz = require('../models/quiz');
const QuestionAnswer = require('../models/questionAnswer');
const Answer = require('../models/answer');

const router = express.Router();

router.post('/findByIdDisicpline', async (req, res) => {
    try {
        const { idDiscipline, idQuestion } = req.body;
        const quizzes = await Quiz.find({idDiscipline}).populate(['idUser', 'idDiscipline', 'questionAnswer']);
                
        const idAnswers = quizzes.map(quiz => {
            const idAnswer = quiz.question_answer.map(item => item.idQuestion == idQuestion ? item.idAnswer : null);
            return idAnswer;
        });

        const answers = await Promise.all(idAnswers.map(async item => {
            const answer = Answer.find(item[0])
            return answer
        }));

        const total = answers.reduce((total, item) => {
            return total += parseFloat(item[0].title, 10)
        }, 0);

        console.log('Total: ', total)

        return res.send({ answers });
    } catch (err) {
        res.status(400).send({ error: 'Erro ao consultar questionário!' })
    }
});

module.exports = app => app.use('/teste', router);