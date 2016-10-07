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
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();

Date.prototype.customFormat = function (formatString) {
    var YYYY, YY, MMMM, MMM, MM, M, DDDD, DDD, DD, D, hhhh, hhh, hh, h, mm, m, ss, s, ampm, AMPM, dMod, th;
    YY = ((YYYY = this.getFullYear()) + "").slice(-2);
    MM = (M = this.getMonth() + 1) < 10 ? ('0' + M) : M;
    MMM = (MMMM = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][M - 1]).substring(0, 3);
    DD = (D = this.getDate()) < 10 ? ('0' + D) : D;
    DDD = (DDDD = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][this.getDay()]).substring(0, 3);
    th = (D >= 10 && D <= 20) ? 'th' : ((dMod = D % 10) == 1) ? 'st' : (dMod == 2) ? 'nd' : (dMod == 3) ? 'rd' : 'th';
    formatString = formatString.replace("#YYYY#", YYYY).replace("#YY#", YY).replace("#MMMM#", MMMM).replace("#MMM#", MMM).replace("#MM#", MM).replace("#M#", M).replace("#DDDD#", DDDD).replace("#DDD#", DDD).replace("#DD#", DD).replace("#D#", D).replace("#th#", th);
    h = (hhh = this.getHours());
    if (h == 0) h = 24;
    if (h > 12) h -= 12;
    hh = h < 10 ? ('0' + h) : h;
    hhhh = hhh < 10 ? ('0' + hhh) : hhh;
    AMPM = (ampm = hhh < 12 ? 'am' : 'pm').toUpperCase();
    mm = (m = this.getMinutes()) < 10 ? ('0' + m) : m;
    ss = (s = this.getSeconds()) < 10 ? ('0' + s) : s;
    return formatString.replace("#hhhh#", hhhh).replace("#hhh#", hhh).replace("#hh#", hh).replace("#h#", h).replace("#mm#", mm).replace("#m#", m).replace("#ss#", ss).replace("#s#", s).replace("#ampm#", ampm).replace("#AMPM#", AMPM);
};


function showTimetablePage() {

    var loginPage = $(".login")
    var timetablePage = $(".timetable")

    loginPage.css("visibility", "hidden");
    timetablePage.css("visibility", "visible");

}

function showLoginPage() {
    var loginPage = $(".login")
    var timetablePage = $(".timetable")

    loginPage.css("visibility", "visible");
    timetablePage.css("visibility", "hidden");

}

function doLogin() {

    var userId = document.getElementById("userId").value;
    var password = document.getElementById("password").value;

    if (userId.trim() == "" || password.trim() == "") {
        //error
        //console.log("UserId and Password cannot be empty");
        ShowMessageAlert("", "User Id and Password cannot be empty");
    } else {

        var data = JSON.stringify({
            "userId": userId,
            "password": password
        });

        makeRequest("POST", "http://127.0.0.1:8080/timetable", data);
    }

}

function makeRequest(method, url, datatosend) {


    $.ajax({
        type: method,
        url: url,
        //async: false,
        data: datatosend,
        contentType: "application/json",
        dataType: "json",
        //cache: false,

        processData: false,
        success: function (result) {
            //            console.log(result);
            populateData(result);

        },
        error: function (result) {
            dealWithAnswer(result);
        }
    });

}

function populateData(data) {

    //fill the info in the form
    fillTable(data);
    //hide the login page, show timetable page
    showTimetablePage();

}


function fillTable(data) {
    var row = "";
    var item;
    var dateText = "";
    var strText = "";

    //clean the timetable
    document.getElementById("data-container").innerHTML = "";

    row = '<div class="row-day">' + data.username + '</div>';
    var count = data.slots.length;
    for (i = 0; i < count; i++) {
        item = data.slots[i];
        //console.log(item);

        var dateTime = new Date(item.start);
        var dateFormatted = new Date(item.start).customFormat("#DD#/#MM#/#YYYY#");

        if (dateText != dateFormatted) {
            //col-sm-12
            strText = '<div class="row-day">' + (dateTime).customFormat("#DDD#, #D#-#MMM#-#YYYY#") + '</div>';
            dateText = dateFormatted;
        } else {
            strText = "";
        }
        row = row +
            //item.id is the timestamp (primary key)
            '<div class="row row-prop">' +
            strText +
            '<div class="col-xs-6 time">' +
            (new Date(item.start)).customFormat("#hh#:#mm#") +
            '</div>' +
            '<div class="col-xs-6 detail-column">' +
            '<ul>' +
            '<li>' +
            item.subject +
            '</li>' +
            '<li>' +
            item.classroom +
            '</li>' +
            '<li>' +
            (new Date(item.start)).customFormat("#hh#:#mm# #ampm#") + " - " + (new Date(item.end)).customFormat("#hh#:#mm# #ampm#") +
            '</li>' +
            '</ul>' +
            '</div>' +
            '</div>';

    }
    // add the timetable data to the webpage
    document.getElementById("data-container").innerHTML = row;

}

function dealWithAnswer(result) {

    switch (result.status) {
    case 401:
        ShowMessageAlert("", result.responseJSON.username)
        break;
        //    case n:
        //        code block
        //        break;
    default:
        ShowMessageAlert("", result.status);
    }

}

function ShowMessageAlert(id, message) {

    document.getElementById("message-alert").innerHTML = "";

    var messageBox =
        '<div class="alert alert-danger alert-dismissable fade in">' +
        '<button type="button" class="close" data-dismiss="alert" aria-hidden="true"> &times;</button>' +
        '<Strong>' + message + '</Strong></div>';

    //message-alert

    // add the timetable data to the webpage
    document.getElementById("message-alert").innerHTML = messageBox;
}

function doLogout() {
    document.getElementById("userId").value = "";
    document.getElementById("password").value = "";
    showLoginPage();
}

function setEvents() {
    //    document.getElementById("floating-button-right").addEventListener("click", showTimetableEntry);
    //    document.getElementById("floating-button-left").addEventListener("click", showTimetableEntry);
    document.getElementById("login-button").addEventListener("click", doLogin);
    document.getElementById("logout-button").addEventListener("click", doLogout);
    //    #login
}

$(document).on('ready', function () {
    //register the event for the components
    setEvents();
    showLoginPage();
    //showTimetableEntry();
})

$(document).ready(function () {
    // Handler for .ready() called.
    //setEvents();
    //showTimetableEntry();
});