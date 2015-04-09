var express = require('express');
var router = express.Router();

var mongoClient = require('mongodb').MongoClient,
    mongoUrl = 'mongodb://localhost:27017/SurveyEngine';

var redis  =require("redis"),
    redisClient = redis.createClient(6379, "127.0.0.1", {});

redisClient.on("error", function(err) {
   console.log("Redis error: " + err); 
});


function logRequest(req){
    
    mongoClient.connect(mongoUrl, function(err, db) {
        if (err) {
            console.log("Failed to connect to " + mongoUrl + ": " + err);
            return;
        }
        var requestLog = db.collection('RequestLog');
        requestLog.insert({
            request: {
                baseUrl : req.baseUrl,
                body: req.body,
                cookies: JSON.stringify(req.cookies),
                hostname: req.hostname,
                params: JSON.stringify(req.params),
                path: req.path,
                query: req.query
            }
        }, function(err, result) {
            if (err)
                console.log(err);
            db.close(); 
        });
    });
    
    
}
    

router.route('/')
    
    .get(function(req, res, next) {
        res.render('index', { title: 'Survey Engine' });
});


router.route('/survey/:surveyId')

    .get(function(req, res, next) {    
        logRequest(req);
    
        // todo: pull from redis/mongo
        var response = {
            surveyId:   req.params.surveyId,
            source:     "CSI", // Source will negotiate the type of response that can be sent
            questions:  [ 1 , 2 , 3 , 4 , 5 , 6 ],
            // [eric]  is  language assumed to be passed in head?
            //         or should we give a list of available languages for client to choose?
            language:   "en-us",
            verbosity:  "Content" // Markup ShortContent
        };
    
    
    res.json(response);
});


router.route('/survey/:surveyId/question/:questionId')

    .get(function(req, res, next) {
        logRequest(req);
    
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
    })

    .post(function(req, res, next) {
        logRequest(req);
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

router.route("/seedSurveys")

    .get(function(req, res, next) {
        
        // todo: seed mongo 

        // seed cache
        var surveys = [
            {  surveyId: 1, questions:  [ 1 , 2 , 3 , 4 , 5 , 6 ], languages: ["en-us", "en-gb", "es-es", "es-mx"] },
            {  surveyId: 2, questions:  [ 1 , 2 , 3 , 7 , 8 , 9 ], languages: ["en-us", "en-gb"] }
        ]
        for (var ndx = 0; ndx < surveys.length; ndx++)
            redisClient.set("survey:" + surveys[ndx].surveyId, JSON.stringify(surveys[ndx]), redis.print);
        redisClient.quit();
        res.send("Done seeding " + surveys.length + " surveys in cache");
    });


module.exports = router;
