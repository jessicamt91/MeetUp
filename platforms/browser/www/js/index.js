/**---------------------------
SIGNUP AND LOGIN FOR PARSE.COM HTML 
---------------------------**/
/** BUTTON STYLING **/
$('.js-signup-form').on('click', function() {
    window.location = 'signupform.html'
});

$('.js-login-form').on('click', function() {
    window.location = 'loginform.html'
});

/** signupform.html -- SIGN UP VIA PARSE **/
$('.signup').on('click', function(e) {
    Parse.initialize("Cpo57dfkHJfnHUoO4MVztot7lwUTTTl7JS8prOi7", "iWeYqkPudnAh44JRcP04vwl5fvK8OBxcG0YRcttm");
    var username = $("#signup-username").val();
    var password = $("#signup-password").val();
    var phoneNumber = $("#signup-phonenumber").val();

    var user = new Parse.User();
    user.set("username",username);
    user.set("password",password);
    user.set("phoneNumber",phoneNumber);

    user.signUp(null, {
        success: function (user){
           console.log('success');
          window.location.href = 'meetup.html';
        },
        error:function (user, error) {
            console.log("Error: " + error.code + " " + error.message);
            window.alert(error.code + " " + error.message);
           window.location.href = 'loginform.html';
        }
    })
    $(".signup-form button").attr("disabled", "disabled");

    return false;
});


/* SIGN IN with email */
$('#authorize-button-email').on('click',function(){
 Parse.initialize("Cpo57dfkHJfnHUoO4MVztot7lwUTTTl7JS8prOi7", "iWeYqkPudnAh44JRcP04vwl5fvK8OBxcG0YRcttm");
 var currentUser = Parse.User.current();
if (currentUser) {
    // do stuff with the user
    console.log('current user: '+ currentUser);
    window.location.href = "meetup.html";
} else {
    // show the signup or login page
    var username = $("#login-username").val();
    var password = $("#login-password").val();
    Parse.User.logIn(username, password, {
        success: function(user){
          window.alert('Welcome Back , '+ username);
          //console.log('login successful');
          //console.log(JSON.stringify(user));
          window.open ('meetup.html','_self',false);
        },
        error: function(user, error){
          console.log(JSON.stringify(user));
          console.log(error);
          window.open ('login.html','_self',false);
        }
    });
  }
});

/**---------------------------
MEETUP.HTML 
---------------------------**/
/** meetup.html -- GET ALL USERS IN PARSE **/
function checklistFriends(){
    $('#invite').prop('disabled', true);
     Parse.initialize("Cpo57dfkHJfnHUoO4MVztot7lwUTTTl7JS8prOi7", "iWeYqkPudnAh44JRcP04vwl5fvK8OBxcG0YRcttm");

    var User = Parse.Object.extend("User");
    var query = new Parse.Query(User);
    query.notEqualTo("objectId", "");
    query.find({
        success: function(response) {
            var i = 0
            response.forEach(function(value, key) {
                var entry =  "<input type='checkbox' name='checkboxes' id= '"+i+ "' value='" + value.id +","+ value.get('username')  + "'/>" + value.get('username') + "<br/>";
                $(entry).appendTo('#listOfFriends');
                $('#add').removeClass("hidden");
                i++;
            })

        },
        error: function(object, error) {
            console.log(error);
           
        }
    })
}

/** meetup.html -- ADD SELECTED USERS TO listOfMeetups.html **/
$('#add').on('click', function(){
    var address = document.getElementById('pac-input').value;
    //console.log(address);
    if(address == ''){
        window.alert('Please specify single location for a meetup');
        console.log('Please specify single location for a meetup');
    }else{
        var listOfFriendsLength = document.getElementsByName('checkboxes').length;
        var i = 0;
        var userIdList = [];
        while(i<listOfFriendsLength){
            if(document.getElementById(i).checked){
                userIdList.push(document.getElementById(i).value);
            }
            i++;
        }

        Parse.initialize("Cpo57dfkHJfnHUoO4MVztot7lwUTTTl7JS8prOi7", "iWeYqkPudnAh44JRcP04vwl5fvK8OBxcG0YRcttm");
        var Meetings = Parse.Object.extend("Meetings");
        var meetingList = new Meetings();

        var j=0;
        var result =[];
        while(j < userIdList.length){
            var users = userIdList[j].split(",");
            result.push(users[0]);
            j++;
        };
        var data = {
            'userId' : result,
            'address' : address
        };
        meetingList.save(data,{
            success : function(meetingList){
                console.log("Inserted");
                window.alert("A meetup at " + address +" is successfully created");
               // window.location.href = "listOfMeetups.html";
            },
            error: function(meetingList, error){
                console.log(error.code + "," + error.message);
               
            } 
        });
    }
   
});

/**---------------------------
 LIST OF MEETUPS.HTML 
---------------------------**/

/** listOfMeetups.html -- RECEIVE ALL MEETUPS **/
function retrieveListOfMeetups(){
    Parse.initialize("Cpo57dfkHJfnHUoO4MVztot7lwUTTTl7JS8prOi7", "iWeYqkPudnAh44JRcP04vwl5fvK8OBxcG0YRcttm");
    var Meetings = Parse.Object.extend("Meetings");
    var query = new Parse.Query(Meetings);
    query.notEqualTo("objectId", "");
    query.find({
        success: function(response) {
            var meetupsCount = response.length;

            var j = 0;
            response.forEach(function(value, key) {
                var userIds = value.get("userId");
                var address = value.get("address");
                var locations = Parse.Object.extend("Locations");
                var q = new Parse.Query(locations);
                q.containedIn("userId", userIds);
                q.find({
                    success: function(response) {
                        var entry ="<a href='#' data-toggle='collapse' data-target='#meetup"+ j +"' class='list-group-item' onclick='javascript:showMaps("+j+","+ meetupsCount +")'>" + value.id + " (Meeting Point : "+ address +") </a> ";
                        entry = entry + "<div id='meetup" + j + "' class='collapse'>";
                        var locations = [];
                        var maps = 0;
                        response.forEach(function(value, key) {
                            var userId = value.get("userId");
                            var smsLink = "<a href='sms.html?userId="+ userId + "'><button class='btn btn-warning top-margin-1'> Send SMS </button></a>"; 
                             console.log(smsLink);
                             entry = entry + "<div id='row-detail'>" + value.get("userId") + " is currently located at Latitude = " + value.get("latitude")+" & Longitude = "+value.get("longitude") + smsLink + "</div>";
                             locations[maps] = [value.get("userId"), value.get("latitude"), value.get("longitude"),value.get("maps")];
                             maps++;
                        });
                        entry = entry + "</div> ";
                        $(entry).appendTo('#listOfMeetups');

                        var entry1 = "<div class='col-xs-12' id='content'> <div id='map"+j +"' style='width : 500px; height: 200px' class='hidden'></div></div>"
                        $(entry1).appendTo('#maps');

                         var map = new google.maps.Map(document.getElementById('map'+j), {
                          zoom: 10,
                          center: new google.maps.LatLng(1.32599, 103.82361),
                          mapTypeId: google.maps.MapTypeId.ROADMAP
                        });

                        var infowindow = new google.maps.InfoWindow();

                        var marker, i;
                        //console.log(locations[0][0]+":"+locations[0][1]+":"+locations[0][2]);
                        for (i = 0; i < locations.length; i++) {  
                          marker = new google.maps.Marker({
                            position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                            map: map
                          });

                          google.maps.event.addListener(marker, 'click', (function(marker, i) {
                            return function() {
                              infowindow.setContent(locations[i][0]);
                              infowindow.open(map, marker);
                            }
                          })(marker, i));
                        }

                       j++;
                    },
                    error: function(object, error) {
                        console.log(error.code + " , "+  error.message);
                       
                    }
                })
            })

        },
        error: function(object, error) {
            console.log(error);
           
        }
    })
}

/** listOfMeetups.html -- SHOW GOOGLE MAPS ON THE SELECTED MEETUP **/
function showMaps(count, totalCount){
    $('#map'+count).removeClass("hidden");
     $('#meetup'+count).attr('aria-expanded', true);
    var i=0;
    while(i < totalCount){
        if(i != count){
            $('#map'+i).addClass("hidden");
            $('#meetup'+i).attr('aria-expanded', false);
        };
        i++;
    }
}

/** listOfMeetups.html -- SEND SMS TO SELECTED PERSON **/
function sendSms(){
    var phoneNumber = document.getElementById("phoneNumber").value;
    var message = document.getElementById("message").value;

    if (phoneNumber !== '' && message !== ''){
        window.location.href = "sms:"+phoneNumber+"&body="+message;
        console.log('Message Sent');
    }else {
        window.alert('Please fill in details');
        console.log('Please fill in details');
    }; 
}
/** SMS **/
function getPhoneNumberByUserId(userId){
    Parse.initialize("Cpo57dfkHJfnHUoO4MVztot7lwUTTTl7JS8prOi7", "iWeYqkPudnAh44JRcP04vwl5fvK8OBxcG0YRcttm");
    var User = Parse.Object.extend("User");
    var query = new Parse.Query(User);
    query.equalTo("objectId", userId);
    query.find({
        success: function(results){
            $('#phoneNumber').val(results[0].get('phoneNumber'));
            $('#username').val(results[0].get('username'));
        },
        error: function(object, error){
            console.log(error.code + " : " + error.message);
           
        }
    })
}

/** SMS -- PASS USERNAME from listOfMeetups.html to sms.html via URL **/
function getParameterByName(name){
    name = name.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}


/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        var success = function(status) {
            alert('Message: ' + status);
        }

        var error = function(status) {
            alert('Error: ' + status);
        }
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        // var parentElement = document.getElementById(id);
        // var listeningElement = parentElement.querySelector('.listening');
        // var receivedElement = parentElement.querySelector('.received');

        // listeningElement.setAttribute('style', 'display:none;');
        // receivedElement.setAttribute('style', 'display:block;');

        // window.localStorage.clear();
        // window.cache.cleartemp();
        console.log('Received Event: ' + id);

    },
};

