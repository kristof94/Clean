$('document').ready(function () {

  $(document).scroll(function () {
    var $nav = $(".navbar-fixed-top");
    $nav.toggleClass('scrolled', $(this).scrollTop() > $nav.height());
  });

  $("#fakeLoader").hide();
  $("#fakeLoader").fakeLoader({
    bgColor:"#06afdad7",
  });
  $('.nav-link, nav-item').click(function () {
    var sectionTo = $(this).attr('href');
    if(sectionTo != null){
      $('html, body').animate({
        scrollTop: $(sectionTo).offset().top
      }, 1000);
    }
  });
});


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

function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
      var cookie = jQuery.trim(cookies[i]);
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

function postTokenToAuth(uid, idToken, user) {
  $.ajax({
    url: '/login',
    type: 'post',
    headers: {
      'X-CSRF-Token': $('meta[name=_token]').attr("content")
    },
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify({
      uid: uid,
      idToken: idToken,
      user: user
    }),
    success: function (data) {
      console.log(data);
      if (data.success) {
        window.location.href = "/profile";
      }
    },
    error: function (error, data) {
      status = error.status;
      if (status == 401) {
        firebase.auth().signOut()
          .then(function () {
            console.log("ici");
          })
          .catch(function (error) {

          });
      }
    }
  });
}

function initAuthenticationWithFireBase() {
  launchGooglePopUp();
}

function launchFacebookPopUp(){
  var provider = new firebase.auth.FacebookAuthProvider();
  firebase.auth().signInWithPopup(provider).then(function (result) {
    // This gives you a Google Access Token. You can use it to access the Google API.
    launchAuth();
  }).catch(function (error) {
    // Handle Errors here.
    console.log(error);
  });
}

function detectContext() {
  console.log(detectContext);
}

function sendTokenWithUser() {
  firebase.auth().currentUser.getIdToken( /* forceRefresh */ true).then(function (idToken) {
    // Send token to your backend via HTTPS  
    var user = firebase.auth().currentUser;
    if (user) {
      var uid = user.uid;
      var userCustom = {
        name: user.displayName,
        email: user.email,
      };
      postTokenToAuth(uid, idToken, userCustom);
      console.log('log in');
    } else {
      // No user is signed in.
    }
  }).catch(function (error) {
    // Handle error
  });
}

function logOut() {
  $("#fakeLoader").show();
  firebase.auth().signOut().then(function () {
    console.log("logOut");
    $.ajax({
      url: "/sessionLogout",
      type: 'post',
      headers: {
        'X-CSRF-Token': $('meta[name=_token]').attr("content")
      },
      success: function (data) {
        console.log("success");        
        if (data) {
          window.location.href = "/";
        }
      },
      error: function (error, data) {
        console.log("error");
        status = error.status;        
      }
    });
  }).catch(function (error) {
    console.log(error);
  });
}

function launch(email,password) {
  firebase.auth().signInWithEmailAndPassword(email, password)
  .then(function (result) {
    if(result.user.emailVerified){
      launchAuth();
    }else{
      console.log("not ok");
    }
  }).catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorMessage);
      // ...
  });
}

function launchGooglePopUp() {
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider).then(function (result) {
    // This gives you a Google Access Token. You can use it to access the Google API.
    launchAuth();
  }).catch(function (error) {
    // Handle Errors here.
    console.log(error);
  });
}

function launchAuth(){
  $('#login-modal').modal('toggle');
    $("#fakeLoader").show();    
    sendTokenWithUser();
}

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    console.log('log in');    
  }
});
