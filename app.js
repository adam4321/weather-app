/***********************************************************************
** Author:       Adam Wright
** Description:  Node webserver that makes calls to the open weather api
**               and returns the results to the client side weather
**               widget.
***********************************************************************/

let express = require('express');
let app = express();

// Set static port = 6000
app.set('port', 6000);



app.listen(app.get('port'), function() {
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
