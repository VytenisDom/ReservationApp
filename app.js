const http = require('http');
//const script = require('./webapp/index.js');
const fs = require('fs');
const port = 3000;

// Main server function
const server = http.createServer(function(req, res){
    // Specifying the content type of our data for browser to understand that it's html and parse it
    res.writeHead(200, {'Content-Type' : 'text/html'});
    // Checking if the required file is present
    fs.readFile('webapp/index.html', function(err, data){
        if(err){
            res.WriteHead(404);
            res.write('Error: File not found.');
        } else {
            // Good to go, serve the website
            res.write(data);
        }
        res.end();
    });
});

// Function for listening on specified port
server.listen(port, function(err){
    if(err){
        console.log("Ooops! Something went wrong!");
    } else {
        // Everythings fine, starting the server
        console.log('Server is listening on port ' + port);
    }
});