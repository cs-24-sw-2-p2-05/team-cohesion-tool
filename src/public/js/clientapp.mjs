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
    let element = document.getElementById(elementID);
    element.style.visibility = "visible";
}

function hideElementByID(elementID) {
    let element = document.getElementById(elementID);
    element.style.visibility = "hidden";
} */

function disableElementByID(elementID) {
    let element = document.getElementById(elementID);
    if (element) {
        //console.log("disableElementByID: " + elementID);
        element.style.display = "none";
    } else {
        console.error("disableElementByID: Element not found with ID: " + elementID);
    }
}

function enableElementByID(elementID) {
    let element = document.getElementById(elementID);
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
    let selectionID = navBtnID.replace("btn", "section");
    //console.log("navMenuBtnToSelection: " + navBtnID + " to " + selectionID);
    return selectionID;
}

// Hide all selections
function hideAllSelections() {
    let menuBtns = document.querySelectorAll("nav button"); // Get all nav buttons
    menuBtns.forEach(element => {
        let navBtnID = element.id;
        disableElementByID(navMenuBtnToSelection(navBtnID));
        //console.log("hideAllSelections: " + navMenuBtnToSelection(navBtnID)); 
    });
}

// Show selection
function showSelection(navBtnID) {
    hideAllSelections();
    enableElementByID(navMenuBtnToSelection(navBtnID));
}

// Hide selection
function navButtonHandler(event) {
    let navBtnID = event.target.id;
    showSelection(navBtnID);
}


/* HTML Event listeners */

// Add eventlisteners to nav buttons
function addNavButtonEventlisteners() {
    let menuBtns = document.querySelectorAll("nav button"); // Get all nav buttons
    menuBtns.forEach(element => {
        element.addEventListener("click", navButtonHandler);
    });
}

// If DOM is fully loaded, add eventlisteners to nav buttons
document.addEventListener("DOMContentLoaded", addNavButtonEventlisteners);
