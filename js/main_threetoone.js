/* eslint-env browser */
/* eslint "no-console": "off"  */
/* global$ */

var Headers = document.querySelector('[data-page]').getAttribute("data-page");
console.log(Headers)
var url;

if (Headers == "senate") {
    url = "https://api.propublica.org/congress/v1/113/senate/members.json";
    console.log(url)
}
if (Headers == "house") {
    url = "https://api.propublica.org/congress/v1/113/house/members.json";
}

var data;
var members;

fetch(url, {
        method: "GET",
        headers: {
            'X-API-Key': "L4NyCMUGLPuxDuLM35JcgX4I6d4vwIfRtLAMKLhY"
        }
    })
    .then(function (response) {
        if (response.ok) {
            return response.json();
        }
        throw new Error(response.statusText);
    })
    .then(function (json) {
        data = json;
        console.log(data)

        tablefillCongress();

        noRepeatArrOp();
        StateFilter();
        PartyFilter();

    });

function tablefillCongress() {
    var members = data.results[0].members;
    var tablebody = document.getElementById("tableBody");

    for (var x = 0; x < members.length; x++) {
        var tabletr = document.createElement("tr");
        var nameTd = document.createElement("td");
        var partyTd = document.createElement("td");
        var stateTd = document.createElement("td");
        var seniorityTd = document.createElement("td");
        var percentageTd = document.createElement("td");


        var fullName;
        if (members[x].middle_name == null) {
            fullName = members[x].first_name + " " + members[x].last_name;
        } else {
            fullName = members[x].first_name + " " + members[x].middle_name + " " + members[x].last_name;
        }

        var link = document.createElement("a");
        link.setAttribute('href', members[x].url);
        nameTd.appendChild(link);
        link.textContent = fullName;

        partyTd.textContent = members[x].party;
        stateTd.textContent = members[x].state;
        seniorityTd.textContent = members[x].seniority;
        percentageTd.textContent = members[x].votes_with_party_pct;


        tabletr.appendChild(nameTd);
        tabletr.appendChild(partyTd);
        tabletr.appendChild(stateTd);
        tabletr.appendChild(seniorityTd);
        tabletr.appendChild(percentageTd);

        tablebody.appendChild(tabletr);

    }
}


function noRepeatArrOp() {

    var tb = document.getElementById("tableBody");
    var tr = tb.rows;
    var noRepeatStateArr = [];
    var select = document.getElementById("filterState");

    for (var i = 0; i < tr.length; i++) {


        if (noRepeatStateArr.indexOf(tr[i].childNodes[2].innerText) < 0) {
            noRepeatStateArr.push(tr[i].childNodes[2].innerText);
        }
    }

    noRepeatStateArr.sort();
    for (var k = 0; k < noRepeatStateArr.length; k++) {
        var options = document.createElement("option");
        options.textContent = noRepeatStateArr[k];
        options.setAttribute("value", noRepeatStateArr[k]);


        select.appendChild(options);
    }
}


function StateFilter() {

    var selectedOption_Value = document.getElementById("filterState").value;

    var tb = document.getElementById("tableBody");

    var tr = tb.rows;

    for (var i = 0; i < tr.length; i++) {

        var tdState = tr[i].childNodes[2].innerText;

        if (selectedOption_Value == "All") {

            tr[i].style.display = "table-row";
        }

        if (selectedOption_Value != "All") {

            if (selectedOption_Value == tdState) {
                tr[i].style.display = "table-row";

            } else {
                tr[i].style.display = "none";
            }
        }
    }
}


function PartyFilter() {

    var checkedBoxes_Nl = document.querySelectorAll('input[name=party]:checked');
    var checkedBoxes_Values = [];
    for (var k = 0; k < checkedBoxes_Nl.length; k++) {
        checkedBoxes_Values.push(checkedBoxes_Nl[k].value);
    }

    var selectedOption_Value = document.getElementById("filterState").value;

    var tb = document.getElementById("tableBody");
    var tr = tb.rows;

    for (var i = 0; i < tr.length; i++) {

        var tdParty = tr[i].childNodes[1].innerText;
        var tdState = tr[i].childNodes[2].innerText;
        if (checkedBoxes_Values.indexOf(tdParty) > -1 && (selectedOption_Value == tdState || selectedOption_Value == "All")) {
            //            console.log("In if 1")
            tr[i].style.display = "table-row";

        } else if (checkedBoxes_Values.length == 0 && (selectedOption_Value == tdState || selectedOption_Value == "All")) {
            //            console.log("In if 2")
            tr[i].style.display = "table-row";

        } else {
            tr[i].style.display = "none";
            //            console.log("none")
        }
    }
}

document.getElementById('checkboxR').addEventListener("click", PartyFilter);
document.getElementById('checkboxD').addEventListener("click", PartyFilter);
document.getElementById('checkboxI').addEventListener("click", PartyFilter);
document.getElementById('filterState').addEventListener("change", StateFilter);
