sap.ui.define([
    "sap/m/Button",
    "sap/m/MessageToast"
], function (Button, MessageToast) {
    "use strict";

    new Button({
        text: "Show All Reservations",
        press: function () {
            // Couldn't find out how make the sapui5 table work with this kind of data, so I did it the simple html way ( with Bootsrap so it wouldn't look as horrible )
            document.getElementById('content').innerHTML = '<table class="table table-dark"><tr><th>ID</th><th>Vardas</th><th>Pavardė</th><th>Data</th><th>Laikas</th></tr></table>';
            fetch('http://localhost:3000/getreservations')
                .then(function (response) {
                    return response.json();
                })
                .then(function (json) {
                    var tr;
                    console.log(json);
                    console.log(json.length);
                    for (var i = 0; i < json.length; i++) {
                        tr = $('<tr/>');
                        tr.append("<td>" + json[i].ID + "</td>");
                        tr.append("<td>" + json[i].FirstName + "</td>");
                        tr.append("<td>" + json[i].LastName + "</td>");
                        tr.append("<td>" + json[i].Date + "</td>");
                        tr.append("<td>" + json[i].Time + "</td>");
                        $('table').append(tr);
                    }
                });
        }
    }).placeAt("content");

    new Button({
        text: "Submit",
        press: function () {
            // I'm 100% sure this is absolutely not the way to be doing this,
            // but the documentation for SAPUI5 elements doesn't explain anything and it's way too hard to reserse engineer it. 
            // I'm supposed to send an XML file to the browser, and the innner sap ui core should somehow find it and initialize it and parse it.
            // I'll guess from now I'll use SAPUI5's elements for front-end only, and then try to somehow retrieve inputs from them.
            // Spaghetti, I know, but as of right now, it's the only way I see on how to do this.

            // Getting the date of reservation
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0');
            var yyyy = today.getFullYear();
            today = yyyy + mm + dd;


            // Getting the inputs

            var firstName = document.getElementById("__input0-inner").value;
            var lastName = document.getElementById("__input1-inner").value;
            var time = document.getElementById("__picker0-inner").value;
            var CalendarSelection = document.getElementsByClassName("sapUiCalItemSel");
            var date = CalendarSelection[0].getAttribute('data-sap-day');
            console.log('FirstName' + firstName,
                'LastName' + lastName,
                'Date' + date,
                'Time' + time);

            // Sending the POST request to the server
            var req = new XMLHttpRequest();
            req.open("POST", "http://localhost:3000/postreq", true);
            req.setRequestHeader('Content-Type', 'application/json');
            req.send(JSON.stringify({
                FirstName: firstName,
                LastName: lastName,
                Date: date,
                Time: time,
                DateOfRes : today
            }));
            req.onreadystatechange = function () {
                // If the request completed, close the extension popup
                if (req.readyState == 4){
                    if (req.status == 200){
                        var res = req.responseText;
                        console.log (res);
                    }
                }
            };
        }
    }).placeAt("content");

});

sap.ui.define(["sap/m/Label", "sap/m/Input", "sap/m/TimePicker"], function (Label, Input, TimePicker) {
    "use strict";
    new Label({
        text: "Prašome užpildyti visus langelius ir pasirinkti datą",
        textAlign: "Center",
        width: "100%",
    }).placeAt("content");

    new Input({
        placeholder: "Vardas",
        required: true,
        name: "firstName",
        width: "50%",
    }).placeAt("content");

    new sap.m.TimePicker({
        placeholder: "Pasirinkite vizito laiką",
        minutesStep: 30,
        name: "time",
        displayFormat: "HH:00",
        width: "50%",
    }).placeAt('content');

    new Input({
        placeholder: "Pavardė",
        required: true,
        name: "lastName",
        width: "50%",
    }).placeAt("content");
});

sap.ui.define(['sap/ui/core/mvc/Controller', 'sap/ui/unified/DateRange'],
    function (Controller, DateRange) {
        "use strict";
        new sap.ui.unified.Calendar({
            width: "50%",
            name: "calendar",
            required: true,
        }).placeAt('content'); // Constructing the calendar object
    });


$('document').ready(function () {
    // Adding some simple CSS tweaks so the design is not as bulky, also some is styling in  style.css file
    document.getElementById("__input0").classList.add("paddings");
    document.getElementById("__input1").classList.add("paddings");
    document.getElementById('__calendar0').classList.add("paddings");
    document.getElementById("__picker0").classList.add("paddings");
});