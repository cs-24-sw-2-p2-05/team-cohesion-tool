// INFO:
// This file contains the main client-side logic for the Web-application

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
"use strict";

// Import export with ES6 modules
import { fetchCalculatedData } from "./comms.mjs";
import { fetchProfile, fetchTeam, fetchActivity, fetchInterest, fetchAllInterests, fetchAllTeams, fetchAllActivitiesFromInterest, fetchAllProfilesFromTeam } from "./comms.mjs";
import { postProfile, postTeam, postActivity, postInterest  } from "./comms.mjs";

// DOM update when entering
function initialDOMUpdate() {
    initialInterestDOMUpdate();
    console.log("initialInterestDOMUpdate: Done");
}

function createCheckbox(activities, activity, interestHeading) {
    // Create input checkbox and label elements for each activity
    const inputCheckbox = document.createElement("input");
    const label = document.createElement("label");
    const br = document.createElement("br");

    // Set attributes for checkbox and label
    inputCheckbox.type = "checkbox";
    inputCheckbox.id = activity + "_id";
    inputCheckbox.name = activity + "_name";
    inputCheckbox.value = activity;
    label.htmlFor = activity + "_id";
    label.textContent = activities[activity].name;
    label.title = activities[activity].description;
    
    // Append checkbox and label after the interest heading
    interestHeading.after(br);
    interestHeading.after(label);
    interestHeading.after(inputCheckbox);
}

// Initial update for DOM with data gatehred from server
function initialInterestDOMUpdate() {
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
        }

        // Loop though all interests and get assosiated activities with main interest set to spesific interest,
        // and add chekcbox for each activity to the form
        for (const interest in data) {
            // Get numerical interest id
            const interestID = interest.split("interest_id")[1];
            // Find heading to add checkbox under
            const interestHeading = document.getElementById(interest + "_heading_id");
            
            // Get all activities for the interest and add related checkboxes to DOM
            fetchAllActivitiesFromInterest(interestID).then(activities => {
                for (const activity in activities) {
                    // Create input checkbox and label elements for each activity
                    createCheckbox(activities, activity, interestHeading);
                }
            });
        }
    });

    // Add linebreaks between activities and submit button
    const br = document.createElement("br");
    submitBtn.after(br);
}

initialDOMUpdate();


// HTML elements show/hide functions

// Disable element by ID
function disableElementByID(elementID) {
    const element = document.getElementById(elementID);
    if (element) {
        element.style.display = "none"; 
    } else {
        console.error("disableElementByID: Element not found with ID: " + elementID);
    }
}

// Enable element by ID
function enableElementByID(elementID) {
    const element = document.getElementById(elementID);
    if (element) {
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
    return selectionID;
}

// Hide all selections
function hideAllSelections() {
    const menuBtns = document.querySelectorAll("nav button"); // Get all nav buttons
    menuBtns.forEach(element => {
        const navBtnID = element.id;
        disableElementByID(navMenuBtnToSelection(navBtnID));
    });
}

// Show selection
function showSelection(navBtnID) {
    hideAllSelections();
    enableElementByID(navMenuBtnToSelection(navBtnID));
}

// Event handler for nav buttons
function navButtonHandler(event) {
    const navBtnID = event.target.id;
    showSelection(navBtnID);
}


// HTML Event listeners

// Attach the event listener to each nav button
const navButtons = document.querySelectorAll("nav button"); // Get all nav buttons
navButtons.forEach(button => {
    button.addEventListener("click", navButtonHandler);
});

// Test buttons

const ProfileBtn = document.getElementById("test_profile_btn_id");
ProfileBtn.addEventListener("click", () => {
    console.log("Clicked: test_profile_btn_id");
    const test_json = {
        "profile_id999": {
            "name": "Test Testesen",
            "activity_ids": ["activity_id1", "activity_id2", "activity_id3"],
            "time_availability": ["f1t2","f2t3","f3t4","f4t5"]
        }
    };
    postProfile(999, test_json);
    // TODO: UPDATE DOM
});

const TeamBtn = document.getElementById("test_teams_btn_id");
TeamBtn.addEventListener("click", () => {
    console.log("Clicked: test_teams_btn_id");
    const test_json = {
        "team_id999": {
            "name": "Bakkeskolen",
            "profile_ids": ["profile_id999", "profile_id998", "profile_id997"],
            "time_frame": ["1","2","3","4","5"]
        },
    };
    postTeam(999, test_json);
    // TODO: UPDATE DOM
});

const ActivityBtn = document.getElementById("test_activities_btn_id");
ActivityBtn.addEventListener("click", () => {
    console.log("Clicked: test_activities_btn_id");
    const test_json = {
        "activity_id1": {
            "name": "Star Wars Marathon",
            "description": "Smelly Boys watching Star Wars all day long",
            "main_interest_id": "interest_id999",
            "all_interest_ids": ["interest_id999", "interest_id998"],
            "time_interval": "1"
        },
    };
    postActivity(999, test_json);
    // TODO: UPDATE DOM
});

const InterestBtn = document.getElementById("test_interests_btn_id");
InterestBtn.addEventListener("click", () => {
    console.log("Clicked: test_interests_btn_id");
    const test_json = {
        "interest_id999": {
            "name": "Filmwatchathons"
        },
    };
    postInterest(999, test_json);
    // TODO: UPDATE DOM
});
