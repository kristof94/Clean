const admin = require("firebase-admin");
const bodyParser = require('body-parser')
const routes = require('express').Router();
const serviceAccount = require("../config/fais-ma-vaisselle-53e05-firebase-adminsdk-q2nf5-8dfdb3ae0f.json");
const cookieCheck = require("../config/cookieCheck")(admin);
const cookieGenerator = require("../config/cookieGenerator")(admin);
const users = require('../controller/user.controller.js');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fais-ma-vaisselle-53e05.firebaseio.com"
});

routes.get('/', function (req, res) {
  const sessionCookie = req.cookies.session || '';
  admin.auth().verifySessionCookie(sessionCookie, true /** checkRevoked */).then((decodedClaims) => {
    name = decodedClaims.name == null ? decodedClaims.email : decodedClaims.name;
    res.render('profile.ejs', {
      csrfToken: req.csrfToken(),
      name: name
    });
  }).catch(error => {
    res.render('index.ejs', {
      csrfToken: req.csrfToken()
    });
  });
});

routes.post('/login', bodyParser.json(), cookieGenerator, function (req, res, next) {
  admin.auth().getUserByEmail(req.body.user.email)
    .then(function (userRecord) {
      res.status(200).send({
        success: true,
        url: '/'
      });
    })
    .catch(function (error) {
      res.redirect('/');
    });
});

routes.post('/register', bodyParser.json(), function (req, res, next) {  
  idToken = req.body.idToken.token;
  admin.auth().verifyIdToken(idToken).then((decodedIdToken) => {
    return users.create(req,res);
  })
  .then(data => {
    console.log(data);
  })
  .catch(error=>{
    res.status(401).send('UNAUTHORIZED REQUEST!');
  });
});


routes.post('/sessionLogout', cookieCheck, (req, res) => {
  const sessionCookie = req.cookies.session || '';
  res.clearCookie('session');
  admin.auth().verifySessionCookie(sessionCookie).then((decodedClaims) => {
    return admin.auth().revokeRefreshTokens(decodedClaims.sub);
  }).then(() => {
    res.status(200).send({
      success: true,
      url: '/'
    });
  }).catch((error) => {
    res.redirect('/');
  });
});

module.exports = routes;