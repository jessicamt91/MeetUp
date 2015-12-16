
/* Google oAuth 2.0 */
var clientId = '944946221486-bmlofkt5gr4g8lforf0qgum5p5tfbqmk.apps.googleusercontent.com';
var apiKey = 'AIzaSyDhedFAo-i5NxuggaKMXe_6rY-jUPL33YE';
var scopes = 'https://www.googleapis.com/auth/gmail.readonly';
function handleClientLoad() {
  gapi.client.setApiKey(apiKey);
  window.setTimeout(checkAuth,1);
}

function checkAuth() {
  gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true}, handleAuthResult);
}

function handleAuthResult(authResult) {
  var authorizeButton = document.getElementById('authorize-button-google');
  if (authResult && !authResult.error) {
    authorizeButton.style.visibility = 'hidden';
    makeApiCall();
  } else {
    authorizeButton.style.visibility = '';
    authorizeButton.onclick = handleAuthClick;
  }
}

function handleAuthClick(event) {
  gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, handleAuthResult);
  return false;
}

function makeApiCall() {
/* CHECK MEETUP DATABASE IF IT IS A REGISTERED USER 
IF YES, THEN TRY :) */
/*var status = 200;
  if(status == 200){*/
    window.location.href = 'meetup.html';
  /**}else{
    window.alert('Please sign up with MeetUp first');
  } */
}

/*oAuth 2*/
$('#authorize-button-google').on('click',function(){
 handleClientLoad();
});

/* Facebook API oAuth */

window.fbAsyncInit = function() {
   FB.init({
    appId      : '1698519117051449',
    cookie     : true,  
    xfbml      : true,  
    version    : 'v2.5' 
  });
};

// Load the SDK asynchronously
(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk')); 


// This is called with the results from FB.getLoginStatus().
function statusChangeCallback(response) {
  if (response.status === 'connected') {
      var userID = FB.getUserID(); //PRIMARY KEY TO BE SAVED IN MEETUP DB
      console.log('User ID :: ' + userID);
      makeApiCall();
  } else if (response.status === 'not_authorized') {
    // The person is logged into Facebook, but not your app.
    document.getElementById('status').innerHTML = 'Please log ' +
      'into this app.';
  } else {
    // The person is not logged into Facebook, so we're not sure if
    // they are logged into this app or not.
    document.getElementById('status').innerHTML = 'Please log ' +
      'into Facebook.';
  }
};

function checkLoginState() {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  }

