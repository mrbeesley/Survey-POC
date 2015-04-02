var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Survey Engine' });
});

router.get('/survey/:surveyId', function(req, res, next) {
    res.json({
        // TODO: clearly deliniate between a survey definition & survey instance
        surveyId:   req.params.surveyId,
        source:     "CSI", // Source will negotiate the type of response that can be sent
        questions:  [ 1 , 2 , 3 , 4 , 5 , 6 ],
        // [eric]  is  language assumed to be passed in head?
        //         or should we give a list of available languages for client to choose?
        language:   "en-us",
        verbosity:  "Content" // Markup ShortContent
    });
});

router.get('/survey/:surveyId/question/:questionId', function(req, res, next) {
    res.json({
        questionId: req.params.questionId,
        scoredValue: 5,
        // [eric] is normativeTag needed for client/delivery?
        normativeTag: "OSAT",
        questionType: "SCALED",
        text: "Please rate your overall satisfaction with your visit.",
        // [eric] may want to shorten to "options"
        responseOptions: [
            {
                // [eric] may want to shorten to "value"
                responseValue:1,
                text:"Highly Dissatisfied",
            },
            {
                responseValue:2,
                text:"Dissatisfied"
            },
            {
                responseValue:3,
                text:"Neither Satisfied or Dissatisfied"
            },
            {
                responseValue:4,
                text:"Satisfied"
            },
            {
                responseValue:5,
                text:"Highly Satisfied"
            },
        ]
    });
});

router.post('/survey/:surveyId/question/:questionId', function(req, res, next) {
    res.json({
        dataQualityScore: 78,
        incentive: "20% Off",
        addQuestions: [
            { id:1, text:"Question text", insertAt:5}
        ],
        removeQuestion: [1, 2, 3],
        updateQuestion: [
            {id:1, text:"Question Text"}
        ],
        redirect: {
            url:"google.com/",
            redirectType: 1,
            text:"Would you like to redirect?"
        }
    });
});

module.exports = router;
