const http = require('http');
const mysql = require('mysql');
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
connection.connect(function (err) {
    if (err) {
        console.log('Failed to connect to the database.');
    } else {
        console.log("Succesfully connected to the database.")
    }
})

// Serving the home page when the request is '/'
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/webapp/index.html');
});

// Serving the stylesheet when the request is '/style.css'
app.get('/style.css', function (req, res) {
    res.sendFile(__dirname + '/public/webapp/style.css');
});

// Serving the script file when the request is '/index.js'
app.get('/index.js', function (req, res) {
    res.sendFile(__dirname + '/public/webapp/index.js');
});

// Receiving a post request from '/postreq'. Parsing the JSON body and inserting into the database.
app.post('/postreq', function (req, res) {
    // Data validation

    // Getting number of rows
    connection.query('SELECT COUNT(*) AS num FROM appregistrations', function (err, rows, fields) {
        numOfRows = rows[0].num;

        // Bool variable that will determine whether validation was successful or not
        let success = true;

        // Checking if there aren't any other reservations on chosen time
        connection.query("SELECT * FROM appregistrations", function (err, rows, fields) {
            if (err) {
                console.log("Error : Bad query declaration.");
            } else {
                for (let i = 0; i < numOfRows; i++) {
                    if (rows[i].Date == req.body.Date && rows[i].Time == req.body.Time) {
                        res.send("There is a reservation on this time and date");
                        success = false;
                        break;
                    }
                }
                // If success if true here then there are no reservations on the given time.

                // Now checking if the person hasn't reserved any other appointments in the last week
                if (success) {
                    connection.query("SELECT * FROM appregistrations WHERE FirstName = '" + req.body.FirstName + "' AND LastName = '" + req.body.LastName + "'", function (err, rows, fields) {

                        // Getting the todays date
                        var today = new Date();
                        var dd = String(today.getDate()).padStart(2, '0');
                        var mm = String(today.getMonth() + 1).padStart(2, '0');
                        var yyyy = today.getFullYear();
                        var todaysdate = yyyy + mm + dd;

                        if (rows[0] == undefined) {
                            if (req.body.Date > todaysdate) {
                                // This is the first time a person in registering on the platform and has chosen the time in the future.
                                // Passed all validations

                                if (success) {
                                    connection.query("INSERT INTO appregistrations (FirstName, LastName, Date, Time, DateOfRes, DatePreview) VALUES('" +
                                        req.body.FirstName + "', " +
                                        "'" + req.body.LastName + "', " +
                                        "'" + req.body.Date + "', " +
                                        "'" + req.body.Time + "', " +
                                        "'" + req.body.DateOfRes + "', " +
                                        "'" + req.body.DatePreview + "' )",
                                        function (err) {
                                            if (err) {
                                                console.log("Error : Bad query declaration.");
                                            } else {
                                                console.log("Inserting succesful.");
                                                res.send("Success");
                                            }
                                        });
                                }
                            } else {
                                res.send("The date chosen is in the past instead of the future");
                                success = false;
                            }
                        } else {
                            if (rows[0].DateOfRes > req.body.Date) {
                                res.send("The date chosen is in the past instead of the future");
                                success = false;
                            } else {
                                // The date is properly set.
                                // Get the date of reservation
                                var DateOfReservation = rows[0].DateOfRes;
                                var y = DateOfReservation.slice(0, 4);
                                var m = DateOfReservation.slice(4, 6);
                                var d = DateOfReservation.slice(6, 8);

                                // Checking if the date of reservation is more than today minus a week
                                if ((new Date(y, m, d)).getTime() > new Date(yyyy, mm, dd - 7).getTime()) {
                                    res.send("The same person has reserved an appointment less than a week ago");
                                } else {
                                    // Passed all validations

                                    if (success) {
                                        connection.query("INSERT INTO appregistrations (FirstName, LastName, Date, Time, DateOfRes, DatePreview) VALUES('" +
                                            req.body.FirstName + "', " +
                                            "'" + req.body.LastName + "', " +
                                            "'" + req.body.Date + "', " +
                                            "'" + req.body.Time + "', " +
                                            "'" + req.body.DateOfRes + "', " +
                                            "'" + req.body.DatePreview + "' )",
                                            function (err) {
                                                if (err) {
                                                    console.log("Error : Bad query declaration.");
                                                } else {
                                                    console.log("Inserting succesful.");
                                                    res.send("Success");
                                                }
                                            });
                                    }
                                }
                            }
                        }
                    });
                }
            }
        });
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