// INFO:
// This file contains the main client-side logic for the Web-application

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
'use strict'



/* Fetch helper functions */

// its a lot of the same haha, but nice with methods for each type of fetch

function consoleLogJSONData(data) {
    Object.keys(data).forEach(key => { console.log(key + ": " + data[key]); });
}

function fetchJson(url) {
    console.log("fetchjson: " + url);
    return fetch(url)
    .then(response => {
        if (response.ok) {
            if (response.headers.get('Content-Type').includes('application/json')) {
                return response.json();
            } else {
                throw new Error("Wrong content type, expected JSON");
            }
        } else {
            throw new Error(response.statusText);
        }
    });
}

function parseJson(url) {
    return fetchJson(url)
    .then(data => {
        console.log("Fetched: " + url + ": " + data);
        //consoleLogJSONData(data);
        return data;
    })
    .catch(error => { console.error("fetchProfile: " + profileNumber + ": " + error); });
}

function fetchProfile(profileNumber) {
    return parseJson("/profiles/" + profileNumber);
}

function fetchTeam(teamNumber) {
    return parseJson("/teams/" + teamNumber);
}

function fetchActivity(activityNumber) {
    return parseJson("/activities/" + activityNumber);
}

function fetchInterest(interestNumber) {
    return parseJson("/interests/" + interestNumber);
}

function fetchAllInterests() {
    return parseJson("/interests");
}

function fetchAllTeams() {
    return parseJson("/teams");
}

function fetchAllActivitiesFromInterest(interestNumber) {
    return parseJson("/activities" + "/interests/" + interestNumber);
}

function fetchAllProfilesFromTeam(teamNumber) {
    return parseJson("/profiles" + "/teams/" + teamNumber);
}


/* HTML elements show/hide function */

/* function showElementByID(elementID) {
    const element = document.getElementById(elementID);
    element.style.visibility = "visible";
}

function hideElementByID(elementID) {
    const element = document.getElementById(elementID);
    element.style.visibility = "hidden";
} */

function disableElementByID(elementID) {
    const element = document.getElementById(elementID);
    if (element) {
        //console.log("disableElementByID: " + elementID);
        element.style.display = "none";
    } else {
        console.error("disableElementByID: Element not found with ID: " + elementID);
    }
}

function enableElementByID(elementID) {
    const element = document.getElementById(elementID);
    if (element) {
        //console.log("enableElementByID: " + elementID);
        element.style.display = "block";
    } else {
        console.error("enableElementByID: Element not found with ID: " + elementID);
    }
}


/* HTML DOM functions */

// navMenu buttons mapping to selection
// Returns a string with selection id name, from the navMenu button id
function navMenuBtnToSelection(navBtnID) {
    const selectionID = navBtnID.replace("btn", "section");
    //console.log("navMenuBtnToSelection: " + navBtnID + " to " + selectionID);
    return selectionID;
}

// Hide all selections
function hideAllSelections() {
    const menuBtns = document.querySelectorAll("nav button"); // Get all nav buttons
    menuBtns.forEach(element => {
        const navBtnID = element.id;
        disableElementByID(navMenuBtnToSelection(navBtnID));
        console.log("hideAllSelections: " + navMenuBtnToSelection(navBtnID)); 
    });
}

// Show selection
function showSelection(navBtnID) {
    hideAllSelections();
    enableElementByID(navMenuBtnToSelection(navBtnID));
}

// Event handler for nav buttons
function navButtonHandler(event) {
    console.log("navButtonHandler: " + event.target.id);
    const navBtnID = event.target.id;
    showSelection(navBtnID);
}


/* HTML Event listeners */

// Attach the event listener to each nav button
const navButtons = document.querySelectorAll('nav button'); // Get all nav buttons
navButtons.forEach(button => {
    button.addEventListener('click', navButtonHandler);
});

