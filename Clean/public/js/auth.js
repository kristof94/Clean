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
    console.log(user);
  }
});

function displayLoading($modal, on) {
  if (on) {
    $modal.modal('toggle');
    $("#fakeLoader").show();
  } else {
    $modal.modal();
    $("#fakeLoader").hide();
  }
}

function createUser(email, password) {
  var $modal = $('#register-modal');
  displayLoading($modal, true);

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(function (userCredential) {
      return sendAuthDataToServer(userCredential.user, "\\register");
    })
    .then(response => {
      if (response.code === 100) {
        var user = firebase.auth().currentUser;
        sendMail();
        var message = "Nous avons envoyé un lien de confirmation à cette adresse " + user.email + ". Cliquez <a href='javascript:sendMessage(\"#register-modal\")'>ici</a> si vous ne l'avez pas reçu.";
        msgChange($('#div-register-msg'), $('#text-register-msg'), "text-secondary", message);
      } else {
        window.location.href = response.url;
      }
    })
    .catch(function (error) {
      msgChange($('#div-register-msg'), $('#text-register-msg'), "text-danger", error.message);
    })
    .finally(function () {
      displayLoading($modal, false);
    });
}

function signUser(email, password) {
  var $modal = $('#login-modal');
  displayLoading($modal, true);

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function (result) {
      return sendAuthDataToServer(result.user, "\login");
    })
    .then(function (response) {
      if (response.code === 100) {
        $('#login-modal').modal();
        $("#fakeLoader").hide();
        var message = "Vous n'avez pas validé votre inscription par mail. Cliquez <a href='javascript:sendMessage(\"#login-modal\")'>ici</a> si vous ne l'avez pas reçu.";
        msgChange($('#div-login-msg'), $('#text-login-msg'), "text-secondary", message);
      } else {
        window.location.href = response.url;
      }
    })
    .catch(function (error) {
      displayLoading($modal, false);
      msgChange($('#div-login-msg'), $('#text-login-msg'), "text-danger", error);
    })
    .finally(() => {

    });
}

function sendMail() {
  var actionCodeSettings = {
    url: 'http://192.168.0.19:8080',
    handleCodeInApp: true
  };
  firebase.auth().currentUser.sendEmailVerification(actionCodeSettings)
    .then(function () {
      // Verification email sent.
    })
    .catch(function (error) {
      // Error occurred. Inspect error.code.
    })
    .finally(() => {

    });
}

function sendMessage(modal) {
  var $modal = $(modal);
  displayLoading($modal, true);
  var actionCodeSettings = {
    url: 'http://192.168.0.19:8080',
    handleCodeInApp: true
  };
  firebase.auth().currentUser.sendEmailVerification(actionCodeSettings)
    .then(function () {
      // Verification email sent.
    })
    .catch(function (error) {
      // Error occurred. Inspect error.code.
    })
    .finally(() => {
      displayLoading($modal, false);
    });
}

function launchFacebookPopUp() {
  var provider = new firebase.auth.FacebookAuthProvider();
  launchAuth(provider);
}

function registerWithFaceBook() {
  var $modal = $('#register-modal');
  displayLoading($modal, true);
  var provider = new firebase.auth.FacebookAuthProvider();
  firebase.auth().signInWithPopup(provider)
    .then(function (result) {
      return sendAuthDataToServer(result.user, "\\register");
    })
    .then(function (response) {
      if (response.code === 100) {
        sendMail();
        var message = "Nous avons envoyé un lien de confirmation à cette adresse " + firebase.auth().currentUser.email + ". Cliquez <a href='javascript:sendMessage(\"#register-modal\")'>ici</a> si vous ne l'avez pas reçu.";
        msgChange($('#div-register-msg'), $('#text-register-msg'), "text-secondary", message);
      } else {
        window.location.href = response.url;
      }
    })
    .catch(function (error) {
      msgChange($('#div-register-msg'), $('#text-register-msg'), "text-danger", error);      
    })
    .finally(() => {
      displayLoading($modal, false);
    });
}

function launchGooglePopUp() {
  var provider = new firebase.auth.GoogleAuthProvider();
  launchAuth(provider);
}

function launchAuth(provider) {
  var $modal = $('#login-modal');
  displayLoading($modal, true);
  firebase.auth().signInWithPopup(provider)
    .then(function (result) {
      return sendAuthDataToServer(result.user, "\login");
    })
    .then(function (response) {
      if (response.code === 100) {
        $('#login-modal').modal();
        $("#fakeLoader").hide();
        msgChange($('#div-login-msg'), $('#text-login-msg'), "text-primary", response.message);
      } else {
        window.location.href = response.url;
      }
    })
    .catch(function (error) {
      displayLoading($modal, false);
      msgChange($('#div-login-msg'), $('#text-login-msg'), "text-danger", error);
    })
    .finally(() => {

    });
}

function sendAuthDataToServer(user, url) {
  return user.getIdTokenResult(true).then(function (idToken) {
    return requestAuth(idToken.token, url)
  });
}

function requestAuth(idToken, url) {
  var jsonToken = JSON.stringify({ idToken: idToken });
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
        firebase.auth().signOut();
        reject(Error(req.responseText));
      }
    };
    req.onerror = function () {
      reject(Error("Network Error"));
    };
    req.send(jsonToken);
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

