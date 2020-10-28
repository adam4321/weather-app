/***********************************************************************
** Author:       Adam Wright
** Description:  Node webserver that makes calls to the open weather api
**               and returns the results to the client side weather
**               widget. 
***********************************************************************/

// Set up express and path
const express = require('express');
const app = express();
const path = require('path');

// Set static port = 6060
app.set('port', 6060);

// Set up body-parser
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set up request and api credentials
const request = require('request');
const credentials = require('./credentials.js');

// Set up path to static files
app.use('/weather_app', express.static(path.join(__dirname, 'public')));


// Root GET route that serves index.html --------------------------------------
app.get('/weather_app', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});


// Post route that receives the location and returns the weather --------------
app.post('/weather_app/weather', (req, res, next) => {
    let location = req.body.location;
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${location},us&APPID=${credentials.apiKey}`;

    // Make requst to the weather api
    request(url, function (err, response, body) {
        if (err) {
            console.error('error:', error);
        }
        else {
            // // Log the response for testing
            // console.log(body);

            // Send the weather back to the client app
            res.send(body);
            res.end();
        }
    });
});


// Start the server on the static port ----------------------------------------
app.listen(app.get('port'), function() {
    console.log(`\nExpress started on http://localhost:${app.get('port')}/weather_app;\npress Ctrl-C to terminate.\n`);
});
