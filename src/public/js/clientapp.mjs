// INFO:
// This file contains the main client-side logic for the Web-application

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
'use strict'

// Import export with ES6 modules
import { fetchCalculatedData, fetchProfile, fetchTeam, fetchActivity, fetchInterest, fetchAllInterests, fetchAllTeams, fetchAllActivitiesFromInterest, fetchAllProfilesFromTeam } from './comms.mjs';

// Initial update for DOM with data gatehred from server
function initialInterestDOMUpdate() {
    //console.log("initialDOMUpdate");

    // Get submit button of interests form
    const submitBtn = document.querySelector("#interests_form input[type='submit']");

    // Get all interests and add to interest section form
    fetchAllInterests().then(data => {
        // Loop through all interests and create a div and header for each
        for (const interest in data) {
            // Create a heading element
            const div = document.createElement("div");
            const heading = document.createElement("h3");
            div.id = interest + "_div_id";
            heading.textContent = data[interest].name;
            heading.id = interest + "_heading_id";

            // Appending the heading to the form before the submit button
            submitBtn.before(div);
            div.appendChild(heading);
            
            //console.log(interest, data[interest]);
            //console.log(heading.textContent);
        }

        // Loop though all interests and get assosiated activities, and add chekcbox for each activity to the form
        for (const interest in data) {
            // Get numerical interest id
            const interestID = interest.split("interest_id")[1];
            // Find heading to add checkbox under
            const interestHeading = document.getElementById(interest + "_heading_id");
            
            // Get all activities for the interest and add related checkboxes to DOM
            fetchAllActivitiesFromInterest(interestID).then(activities => {
                for (const activity in activities) {
                    // Create input checkbox and label elements for each activity
                    const inputCheckbox = document.createElement("input");
                    const label = document.createElement("label");
                    const br = document.createElement("br");
                    inputCheckbox.type = "checkbox";
                    inputCheckbox.id = activity + "_id";
                    inputCheckbox.name = activity + "_name";
                    inputCheckbox.value = activity;
                    label.for = activity + "_id";
                    label.textContent = activities[activity].name;
                    
                    // Add to DOM
                    interestHeading.after(br);
                    interestHeading.after(label);
                    interestHeading.after(inputCheckbox);
                }
            //console.log(activities);    
            });
        }
    });

    // add linebreaks between activities and submit button
    const br = document.createElement("br");
    submitBtn.after(br);
    console.log("initialInterestDOMUpdate: Done");
}

initialInterestDOMUpdate();


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
