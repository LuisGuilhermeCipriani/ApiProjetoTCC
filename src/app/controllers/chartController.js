const express = require('express');
const Answer = require('../models/answer');
const Question = require('../models/question');

const router = express.Router();

router.post('/chart', async (req, res) => {
    try {
        const questionnaires = req.body;
        const questions = await Question.find()

        const dataChart = await Promise.all(questions.map(async objectQuestion => {
            const question = await Question.findById(objectQuestion._id)
            const questionnaire = await Promise.all(questionnaires.map(async questionnaire => {
                const questionAnswer = questionnaire.questionAnswer.filter(objectQuestionAnswer =>
                    (objectQuestionAnswer.idQuestion == objectQuestion._id))
                const objQuestionAnswer = await Promise.all(questionAnswer.map(async object => {
                    return await Answer.findById(object.idAnswer)
                }))
                return objQuestionAnswer[0]
            }))

            const answers = await Answer.find()
            const frequency = answers.map(value => {
                return questionnaire.filter(object => (object != undefined)).filter(val => (val.option == value.option)).length
            })

            const sum = answers.map((v, i) => {
                return v.option * frequency[i]
            }).reduce((total, value) => {
                return total += value
            }, 0)

            const weightedAverage = (sum / frequency.reduce((total, value) => { return total += value })) 

            const chart = ({
                _id: question._id,
                title: question.title,
                option: question.option,
                weightedAverage: parseFloat(weightedAverage).toFixed(1)
            })

            return chart
        }))

        return res.status(201).send({ dataChart });
    } catch (err) {
        res.status(400).send({ error: 'Erro ao buscar grafico!' })
    }
});

module.exports = app => app.use('/chartController', router);