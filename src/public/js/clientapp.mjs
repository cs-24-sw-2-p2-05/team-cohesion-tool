// INFO:
// This file contains the main client-side logic for the Web-application

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
'use strict'

// Import export with ES6 modules
import { fetchCalculatedData, fetchProfile, fetchTeam, fetchActivity, fetchInterest, fetchAllInterests, fetchAllTeams, fetchAllActivitiesFromInterest, fetchAllProfilesFromTeam } from './comms.mjs';

// HTML elements show/hide function

/* // Show element by ID, setting visibility to visible, hist it is not grayed out
function showElementByID(elementID) {
    const element = document.getElementById(elementID);
    element.style.visibility = "visible";
}

function hideElementByID(elementID) {
    const element = document.getElementById(elementID);
    element.style.visibility = "hidden";
} */

// Disable element by ID
function disableElementByID(elementID) {
    const element = document.getElementById(elementID);
    if (element) {
        //console.log("disableElementByID: " + elementID);
        element.style.display = "none";
    } else {
        console.error("disableElementByID: Element not found with ID: " + elementID);
    }
}

// Enable element by ID
function enableElementByID(elementID) {
    const element = document.getElementById(elementID);
    if (element) {
        //console.log("enableElementByID: " + elementID);
        element.style.display = "block";
    } else {
        console.error("enableElementByID: Element not found with ID: " + elementID);
    }
}


// HTML DOM functions

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
        //console.log("hideAllSelections: " + navMenuBtnToSelection(navBtnID)); 
    });
}

// Show selection
function showSelection(navBtnID) {
    hideAllSelections();
    enableElementByID(navMenuBtnToSelection(navBtnID));
}

// Event handler for nav buttons
function navButtonHandler(event) {
    //console.log("navButtonHandler: " + event.target.id);
    const navBtnID = event.target.id;
    showSelection(navBtnID);
}


// HTML Event listeners

// Attach the event listener to each nav button
const navButtons = document.querySelectorAll('nav button'); // Get all nav buttons
navButtons.forEach(button => {
    button.addEventListener('click', navButtonHandler);
});
