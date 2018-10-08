const admin = require("firebase-admin");
const bodyParser = require('body-parser')
const routes = require('express').Router();
const serviceAccount = require("../config/fais-ma-vaisselle-53e05-firebase-adminsdk-q2nf5-8dfdb3ae0f.json");
const cookieCheck = require("../config/cookieCheck")(admin);
const cookieGenerator = require("../config/cookieGenerator")(admin);
//const users = require('../controller/user.controller.js');
const checkUser = require('../config/checkUser.js');

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
  res.status(200).send({
    success: true,
    url: '/'
  });
});

routes.get('/login', bodyParser.json(),cookieGenerator, function (req, res, next) {  
  res.status(200).send({
    success: true,
    url: '/'
  });
});

routes.post('/register', bodyParser.json(), function (req, res, next) {
  idToken = req.body.idToken;
  admin.auth().verifyIdToken(idToken).then((decodedIdToken) => {
    return admin.auth().getUser(decodedIdToken.uid);
  }).then(user => {
    return checkUser.isVerifiedEmail(user);
  })
    /*.then(user => {
      return users.create(user.displayName, user.email);
    })*/.then(user => {
        res.cookie('uid',idToken, { maxAge: 50000, httpOnly: true });
        res.redirect('/login');
/*      res.status(200).send({
        success: true,
        url: '/login'
      });*/
    })
    .catch(function (error) {
      if (error.code === 100) {
        res.status(200).send(error);
      } else {
        res.status(401).send('UNAUTHORIZED REQUEST!');
      }
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

function listAllUsers(nextPageToken) {
  // List batch of users, 1000 at a time.
  admin.auth().listUsers(1000, nextPageToken)
    .then(function (listUsersResult) {
      listUsersResult.users.forEach(function (userRecord) {
        console.log("user", userRecord.toJSON());
      });
      if (listUsersResult.pageToken) {
        // List next batch of users.
        listAllUsers(listUsersResult.pageToken)
      }
    })
    .catch(function (error) {
      console.log("Error listing users:", error);
    });
}

routes.get('/deleteAll', (req, res, next) => {
  admin.auth().listUsers(1000)
    .then(function (listUsersResult) {
      listUsersResult.users.forEach(function (userRecord) {
        console.log(userRecord.email);
        admin.auth().deleteUser(userRecord.uid)
          .then(function () {
            console.log("Successfully deleted user");
          })
          .catch(function (error) {
            console.log("Error deleting user:", error);
          });
      });
      if (listUsersResult.pageToken) {
        // List next batch of users.
        listAllUsers(listUsersResult.pageToken);
      }
    })
    .then(u => {
      users.listAll(us => {
        users.remove(us);
      });
      res.status(200).send({ ok });
    })
    .catch(function (error) {
      res.status(401).send({ ko });
      console.log("Error listing users:", error);
    });
});

module.exports = routes;