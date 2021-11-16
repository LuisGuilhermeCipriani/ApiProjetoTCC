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

            // *** OUTLIER ***

            const values = questionnaire.map(o => {
                return o.option
            })

            const fiq = Quartile_75(values) - Quartile_25(values)

            const lowerOutlier = Quartile_25(values) - 1.5 * fiq;

            const uperOutlier = Quartile_75(values) + 1.5 * fiq;

            //console.log('Baixo: ', outbaixo + ', Alto: ' + outalto)

            const OutlierFrequency = answers.map(value => {
                //console.log(dados.filter(object => {return object}))
                return values.filter(object => (object >= lowerOutlier && object <= uperOutlier)).filter(object => (object == value.option)).length
            })

            //console.log('OutlierFrequency   ', OutlierFrequency)

            const outlierSum = answers.map((v, i) => {
                return v.option * OutlierFrequency[i]
            }).reduce((total, value) => {
                return total += value
            }, 0)

            const outlierWeightedAverage = (outlierSum / OutlierFrequency.reduce((total, value) => { return total += value })) 

            const chart = ({
                _id: question._id,
                title: question.title,
                option: question.option,
                weightedAverage: parseFloat(weightedAverage).toFixed(1),
                outlierWeightedAverage: parseFloat(outlierWeightedAverage).toFixed(1),
                lowerOutlier: parseFloat(lowerOutlier).toFixed(1),
                uperOutlier: parseFloat(uperOutlier).toFixed(1)
            })

            return chart
        }))

        return res.status(201).send({ dataChart });
    } catch (err) {
        res.status(400).send({ error: 'Erro ao buscar grafico!' })
    }
});

Median = (data) => {
    return Quartile_50(data);
}

Quartile_25 = (data) => {
    //console.log('Primeiro quartil: ', Quartile(data, 0.25))
    return Quartile(data, 0.25);
}

Quartile_50 = (data) => {
    //console.log('Mediana: ', Quartile(data, 0.5))
    return Quartile(data, 0.5);
}

Quartile_75 = (data) => {
    //console.log('Terceiro quartil: ', Quartile(data, 0.75))
    return Quartile(data, 0.75);
}

Quartile = (data, q) => {
    data=Array_Sort_Numbers(data);
    var pos = ((data.length) - 1) * q;
    var base = Math.floor(pos);
    var rest = pos - base;
    //console.log('Pos: ' + pos + ' Base: ' + base + ' Rest: ' + rest)
    if( (data[base+1]!==undefined) ) {
      return data[base] + rest * (data[base+1] - data[base]);
    } else {
      return data[base];
    }
}

Array_Sort_Numbers = (inputarray) => {
    return inputarray.sort(function(a, b) {
      return a - b;
    });
}

Array_Sum = (t) => {
    return t.reduce(function(a, b) { return a + b; }, 0); 
}

Array_Average = (data) => {
    return Array_Sum(data) / data.length;
}

Array_Stdev = (tab) => {
    var i,j,total = 0, mean = 0, diffSqredArr = [];
    for(i=0;i<tab.length;i+=1){
        total+=tab[i];
    }
    mean = total/tab.length;
    for(j=0;j<tab.length;j+=1){
        diffSqredArr.Push(Math.pow((tab[j]-mean),2));
    }
    return (Math.sqrt(diffSqredArr.reduce(function(firstEl, nextEl){
             return firstEl + nextEl;
           })/tab.length));  
}

module.exports = app => app.use('/chartController', router);