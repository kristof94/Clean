var cookieParser = require('cookie-parser');
var csrf = require('csurf');
var bodyParser = require('body-parser');
var express = require('express');
const routes = require('./route/authRoute');
const http = require('http');
const db = require('./config/db.js');

var csrfProtection = csrf({ cookie: true });
var parseForm = bodyParser.urlencoded({ extended: false });
var app = express();

app.set('port', process.env.PORT || '8081')
app.use(cookieParser())
app.use(csrfProtection);
app.use(parseForm);
app.use(routes);
app.use(bodyParser.json())
app.use(express.static('public'));
app.set('views', __dirname + '/views/' );


// force: true will drop the table if it already exists
db.sequelize.sync({force: false}).then(() => {
  console.log('Drop and Resync with { force: true }');
});
/*
db.sequelize.sync({ force: false }).then(() => {
    console.log('Drop and Resync with { force: false }');
});*/
var server = http.createServer(app);

//require('./route/user.route')(app);
// Reload code here
// Create a Server
server.listen(app.get('port'), function () {
    var host = server.address().address;
    var port = server.address().port;
    var url = 'http://localhost:' + app.get('port');
    console.log("App listening at url");
    if (process.send) {
        process.send({ event: 'online', url: url });
    }
});
