const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'assignment2',
});

const app = express();
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
  extended: true
}));

//Insert a candidate into database
app.post('/addCandidate', function (req, res) {
    var params  = req.body;
    console.log(params);
    connection.query('INSERT INTO candidate SET ?', params, function (error, results, fields) {
       if (error) throw error;
       res.end(JSON.stringify(results));
     });
 });

 //Assign score for a candidate based on the test
 app.post('/addScore', function (req, res) {
    var params  = req.body;
    console.log(req.body);
    connection.query('INSERT INTO test_score SET c_id = ?, first_round_score = ?,' + 
                ' second_round_score = ?, third_round_score = ?', 
                [req.body.c_id,req.body.first,req.body.second,req.body.third], 
        function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results));
     });
 });

 //Api to get highest scoring candidate and average scores per round for all candidates
 app.get('/highScore', function (req, res) {
    connection.query('select c.name, c.email, (SUM(ts.first_round_score) + SUM(ts.second_round_score) + SUM(ts.third_round_score))' +
                    ' as Scores, AVG(ts.first_round_score)' +
                    ' as AvgFirstRound, AVG(ts.second_round_score) as AvgSecondRound,' + 
                    'AVG(ts.third_round_score) as AvgThirdRound from candidate c inner join' + 
                    ' test_score ts ON ts.c_id = c.c_id GROUP BY c.c_id;', function (error, results, fields) {
    if (error) throw error;
       res.end(JSON.stringify(results));
     });
 });
 
 app.listen(3000, () => {
    console.log('Database port mounted at 3000');
  });