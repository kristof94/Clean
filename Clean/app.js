var cookieParser = require('cookie-parser');
var csrf = require('csurf');
var bodyParser = require('body-parser');
var express = require('express');
const routes = require('./route/authRoute');
//const db = require('./config/db.js');

var csrfProtection = csrf({ cookie: true });
var parseForm = bodyParser.urlencoded({ extended: false });
var app = express();


app.use(cookieParser())
app.use(csrfProtection);
app.use(parseForm);
app.use(express.static('public'));
app.use(routes);
app.use(bodyParser.json())


// force: true will drop the table if it already exists
/*db.sequelize.sync({force: true}).then(() => {
  console.log('Drop and Resync with { force: true }');
});*/
/*
db.sequelize.sync({ force: false }).then(() => {
    console.log('Drop and Resync with { force: false }');
});*/

//require('./route/user.route')(app);

// Create a Server
var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("App listening at http://%s:%s", host, port);
});
