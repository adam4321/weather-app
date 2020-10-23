/***********************************************************************
** Author:       Adam Wright
** Description:  Node webserver that makes calls to the open weather api
**               and returns the results to the client side weather
**               widget. 
***********************************************************************/

// Set up express
let express = require('express');
let app = express();
let path = require('path');

// Set static port = 6060
app.set('port', 6060);

// Set up request
const request = require('request');

// Set up path to static files
app.use('/weather_app', express.static('public'));

// Root route that serves index.html
app.get('/weather_app', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
})



// Start the server on the static port
app.listen(app.get('port'), function() {
    console.log(`\nExpress started on http://localhost:${app.get('port')};\npress Ctrl-C to terminate.\n`);
});
