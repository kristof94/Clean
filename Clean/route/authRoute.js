const admin = require("firebase-admin");
const bodyParser = require('body-parser')
const routes = require('express').Router();
const serviceAccount = require("../config/fais-ma-vaisselle-53e05-firebase-adminsdk-q2nf5-6c89d5933f.json");
const cookieCheck = require("../config/cookieCheck")(admin);
const cookieGenerator = require("../config/cookieGenerator")(admin);
const users = require('../controller/user.controller.js');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fais-ma-vaisselle-53e05.firebaseio.com"
});

routes.get('/', function (req, res) {
  res.render('index.ejs', {
    csrfToken: req.csrfToken()
  });
});

routes.get('/profile', cookieCheck, function (req, res) {
  console.log(req.decodedClaims);
  var name = null;
  if(req.decodedClaims.name==null){
    name = req.decodedClaims.email;
  }
  res.render('profile.ejs', {
    csrfToken: req.csrfToken(),
    name: name,
  });
});

routes.post('/login',bodyParser.json(), cookieGenerator, function (req, res,next) {    
  admin.auth().getUserByEmail(req.body.user.email)
  .then(function(userRecord) {
    users.create(req,res);
    next();
  })
  .catch(function(error) {
    res.redirect('/');
  });  
});

routes.post('/sessionLogout',cookieCheck, (req, res) => {
  const sessionCookie = req.cookies.session || '';
  res.clearCookie('session');
  admin.auth().verifySessionCookie(sessionCookie).then((decodedClaims) => {
    return admin.auth().revokeRefreshTokens(decodedClaims.sub);
  }).then(() => {
    res.redirect('/');
  }).catch((error) => {
    res.redirect('/');
  });
});


module.exports = routes;