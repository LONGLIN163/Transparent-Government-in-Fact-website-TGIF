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
var statistics = {

    "NumberofDemocrats": 0,
    "NumberofRepublicans": 0,
    "NumberofIndependents": 0,

    "VotewithPartyForD": 0,
    "VotewithPartyForR": 0,
    "VotewithPartyForI": 0,

    "attendenceTop10Guys": 0,
    "attendenceDown10Guys": 0,
    "loyalTop10Guys": 0,
    "loyalDown10Guys": 0
}

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
        partyNumberAndAvp();
        attendanceTopDown10Pct();
        tablefillGlance();

        tablefillAttendance(statistics.attendenceDown10Guys, document.getElementById("tableAttendanceBottom"));
        tablefillAttendance(statistics.attendenceTop10Guys, document.getElementById("tableAttendanceTop"));

    });



console.log(statistics)

function partyNumberAndAvp() {
    var members = data.results[0].members;
    var Democrats = [];
    var Republicans = [];
    var Independents = [];
    var DemocratAVP = 0;
    var RepublicanAVP = 0;
    var IndependentAVP = 0;

    for (var i = 0; i < members.length; i++) {

        if (members[i].party == "D") {
            Democrats.push(members[i]);
            DemocratAVP += members[i].votes_with_party_pct;

        } else if (members[i].party == "R") {
            Republicans.push(members[i]);
            RepublicanAVP += members[i].votes_with_party_pct;

        } else {
            Independents.push(members[i]);
            IndependentAVP += members[i].votes_with_party_pct;
        }
    }

    DemocratAVP /= Democrats.length;
    RepublicanAVP /= Republicans.length;
    IndependentAVP /= Independents.length;

    statistics.NumberofDemocrats = Democrats.length;
    statistics.NumberofRepublicans = Republicans.length;
    statistics.NumberofIndependents = Independents.length;
    statistics.VotewithPartyForD = DemocratAVP;
    statistics.VotewithPartyForR = RepublicanAVP;
    statistics.VotewithPartyForI = IndependentAVP;
    if (isNaN(statistics.VotewithPartyForI)) {
        statistics.VotewithPartyForI = 0;
    }
    console.log(statistics.VotewithPartyForI)
}

function compare(property) {
    return function (a, b) {
        var value1 = a[property];
        var value2 = b[property];
        return value1 - value2;
    }
}

function attendanceTopDown10Pct() {
    var members = data.results[0].members;
    var newMembers = Array.from(members);
    var membersB_T = newMembers.sort(compare('missed_votes_pct'));
    var new2Members = Array.from(members);
    var membersNol_L = new2Members.sort(compare('votes_with_party_pct'));
    var percent = Math.round(members.length * 0.10);
    var arrayMinMissed = [];
    for (var i = 0; i < percent; i++) {
        arrayMinMissed.push(membersB_T[i]);
    }
    for (var j = percent; j < membersB_T.length; j++) {
        if (arrayMinMissed[arrayMinMissed.length - 1].missed_votes_pct == membersB_T[j].missed_votes_pct) {
            arrayMinMissed.push(membersB_T[j]);
        }
    }

    statistics.attendenceTop10Guys = arrayMinMissed;

    var arrayMaxMissed = [];
    for (var i = membersB_T.length - 1; i > membersB_T.length - percent; i--) {
        arrayMaxMissed.push(membersB_T[i]);
    }

    for (var j = membersB_T.length - percent; j > 0; j--) {
        if (arrayMaxMissed[arrayMaxMissed.length - 1].missed_votes_pct == membersB_T[j].missed_votes_pct) {
            arrayMaxMissed.push(membersB_T[j]);
        }
    }

    statistics.attendenceDown10Guys = arrayMaxMissed;
}


function tablefillGlance() {

    document.getElementById("Rnum").innerHTML = statistics.NumberofRepublicans;
    document.getElementById("Dnum").innerHTML = statistics.NumberofDemocrats;
    document.getElementById("Inum").innerHTML = statistics.NumberofIndependents;

    document.getElementById("Rpet").innerHTML = statistics.VotewithPartyForR.toFixed(2) + " %";
    document.getElementById("Dpet").innerHTML = statistics.VotewithPartyForD.toFixed(2) + " %";
    document.getElementById("Ipet").innerHTML = statistics.VotewithPartyForI.toFixed(2) + " %";

    var table = document.getElementById("glance");
    var tablefoot = document.createElement("tfoot");
    console.log(tablefoot)
    var tabletr = document.createElement("tr");

    var totalNaTd = document.createElement("td");
    var totalNmTd = document.createElement("td");
    var totalPcTd = document.createElement("td");

    totalNmTd.textContent = statistics.NumberofRepublicans + statistics.NumberofDemocrats + statistics.NumberofIndependents;

    totalNaTd.textContent = "total";


    var totalPartyNumberOrigional = [statistics.NumberofDemocrats,
    statistics.NumberofRepublicans,
    statistics.NumberofIndependents];
    console.log(totalPartyNumberOrigional)
    var totalPartyNumberReal = [];
    for (var i = 0; i < totalPartyNumberOrigional.length; i++) {
        if (totalPartyNumberOrigional[i] != 0) {
            totalPartyNumberReal.push(totalPartyNumberOrigional[i]);
        }
    }
    console.log(totalPartyNumberReal)

    totalPcTd.textContent = ((statistics.VotewithPartyForR + statistics.VotewithPartyForD + statistics.VotewithPartyForI) / totalPartyNumberReal.length).toFixed(2) + " %";

    console.log(totalPcTd.textContent)

    tabletr.appendChild(totalNaTd);
    tabletr.appendChild(totalNmTd);
    tabletr.appendChild(totalPcTd);
    tablefoot.appendChild(tabletr);
    table.appendChild(tablefoot); 
    tablefoot.style.fontWeight = "900";
}


function tablefillAttendance(atendanceArray, atendanceTable) {
    var membersOfAttendance = atendanceArray;
    var tablebody = atendanceTable;

    for (var x = 0; x < membersOfAttendance.length; x++) {
        var tabletr = document.createElement("tr");
        var NamTd = document.createElement("td");
        var NumTd = document.createElement("td");
        var PetTd = document.createElement("td");

        var fullName;
        if (membersOfAttendance[x].middle_name == null) {
            fullName = membersOfAttendance[x].first_name + " " + membersOfAttendance[x].last_name;
        } else {
            fullName = membersOfAttendance[x].first_name + " " + membersOfAttendance[x].middle_name + " " + membersOfAttendance[x].last_name;
        }

        var link = document.createElement("a");
        link.setAttribute('href', membersOfAttendance[x].url);
        NamTd.appendChild(link);
        link.textContent = fullName;

        NumTd.textContent = membersOfAttendance[x].missed_votes;
        PetTd.textContent = membersOfAttendance[x].missed_votes_pct;

        tabletr.appendChild(NamTd);
        tabletr.appendChild(NumTd);
        tabletr.appendChild(PetTd);

        tablebody.appendChild(tabletr);

    }
}
