const http = require('http');
const nStatic = require('node-static');
const mysql = require('mysql');
const fileServer = new nStatic.Server('./public');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Telling the server to use the JSON bodyparser module when handling post requests
app.use(bodyParser.json());
app.use(express.json());

// Allowing cross-origin requests to your api url
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const connection = mysql.createConnection({
    // Connection properties
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'registrations'
});

// MySQL connection
connection.connect(function(err){
    if(err){
        console.log('Failed to connect to the database.');
    } else {
        console.log("Succesfully connected to the database.")
    }
})

// Serving the home page when the request is '/'
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/webapp/index.html');
});

// Receiving a post request from '/postreq'. Parsing the JSON body and inserting into the database.
app.post('/postreq', function (req, res) {
    console.log("INSERT INTO appregistrations (FirstName, LastName, Date, Time) VALUES( '"
        + req.body.FirstName + "', "
        + "'" + req.body.LastName + "', "
        + "'" + req.body.Date + "', "
        + "'" + req.body.Time + ")");
    connection.query("INSERT INTO appregistrations (FirstName, LastName, Date, Time) VALUES('" 
    + req.body.FirstName + "', " 
    + "'" + req.body.LastName + "', "
    + "'" + req.body.Date + "', " 
    + "'" + req.body.Time + "' )" , function (err) {
        if (err) {
            console.log("Error : Bad query declaration.");
        } else {
            console.log("Inserting succesful.");
        }
    });
});

// Serving the DB info with api call at '/getreservations'
app.get('/getreservations', function (req, res) {
    connection.query("SELECT * FROM appregistrations", function (err, rows, fields) {
        if (err) {
            console.log("Error : Bad query declaration.");
        } else {
            console.log("Selection succesful.");
            res.json(rows);
        }
    });
});

// Listening on port 3000
app.listen(port, function () {
    console.log('Server is listening on port ' + port);
});
