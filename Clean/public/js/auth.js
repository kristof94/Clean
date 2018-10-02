// Initialize Firebase
var config = {
  apiKey: "AIzaSyDiuJrSmfcFoIlME4IRWFtzH836tkWtgwQ",
  authDomain: "fais-ma-vaisselle-53e05.firebaseapp.com",
  databaseURL: "https://fais-ma-vaisselle-53e05.firebaseio.com",
  projectId: "fais-ma-vaisselle-53e05",
  storageBucket: "fais-ma-vaisselle-53e05.appspot.com",
  messagingSenderId: "120939869444"
};

firebase.initializeApp(config);

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    console.log('log in');
  }
});

function createUser(email, password) {
  $("#fakeLoader").show();
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(function (userCredential) {
      userCredential.user.getIdTokenResult(true)
        .then(function (idToken) {
          return sendAuthDataToServer(userCredential.user.uid, idToken, userCredential.user,'/register');
        }).catch(function (error) {
          console.log(error);
        });
    })
    .catch(function (error) {    
      msgChange($('#div-register-msg'), $('#icon-register-msg'), $('#text-register-msg'), "error", "glyphicon-remove", error.message);      
    })
    .finally(function () {
      $("#fakeLoader").hide();
    });
}

function launchFacebookPopUp() {
  var provider = new firebase.auth.FacebookAuthProvider();
  launchAuth(provider);
}

function launchGooglePopUp() {
  var provider = new firebase.auth.GoogleAuthProvider();
  launchAuth(provider);
}

function launchAuth(provider) {
  $("#fakeLoader").show();
  $('#login-modal').modal('toggle');
  firebase.auth().signInWithPopup(provider)
    .then(function (result) {
      return firebase.auth().currentUser.getIdToken(true);
    })
    .then(function (idToken) {
      var user = firebase.auth().currentUser;
      if (user == null) {
        throw new Error("Problème, veuillez réessayer.");
      }
      var uid = user.uid;
      var userCustom = {
        name: user.displayName,
        email: user.email,
      };
      return sendAuthDataToServer(uid, idToken, user,'/login');
    })
    .then(function (response) {
      if (response.success) {
        window.location.href = response.url;
      }
    })
    .catch(function (error) {
      msgChange($('#div-login-msg'), $('#icon-login-msg'), $('#text-login-msg'), "error", "glyphicon-remove", error);
      $('#login-modal').modal();
    })
    .finally(function () {
      $("#fakeLoader").hide();
    });
}

function sendAuthDataToServer(uid, idToken, user, url) {
  return new Promise(function (resolve, reject) {
    var req = new XMLHttpRequest();
    req.open('POST', url);
    req.setRequestHeader("X-CSRF-Token", $('meta[name=_token]').attr("content"));
    req.setRequestHeader("Content-Type", "application/json");
    req.onload = function () {
      if (req.status == 200) {
        resolve(JSON.parse(req.response));
      }
      else {
        reject(Error(req.statusText));
      }
    };
    req.onerror = function () {
      reject(Error("Network Error"));
    };
    req.send(JSON.stringify({
      uid: uid,
      idToken: idToken,
      user: user
    }));
  });
}

function sendLogOutToServer() {
  return new Promise(function (resolve, reject) {
    var req = new XMLHttpRequest();
    req.open('POST', '/sessionLogout');
    req.setRequestHeader("X-CSRF-Token", $('meta[name=_token]').attr("content"));
    req.setRequestHeader("Content-Type", "application/json");
    req.onload = function () {
      if (req.status == 200) {
        resolve(JSON.parse(req.response));
      }
      else {
        reject(Error(req.statusText));
      }
    };
    req.onerror = function () {
      reject(Error("Network Error"));
    };
    req.send();
  });
}

function logOut() {
  $("#fakeLoader").show();
  firebase.auth().signOut().then(function () {
    return sendLogOutToServer();
  })
    .then(function (response) {
      if (response.success) {
        window.location.href = response.url;
      }
    })
    .catch(function (error) { })
    .finally(function () {
      $("#fakeLoader").hide();
    });
}

