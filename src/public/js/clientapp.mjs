// INFO:
// This file contains the main client-side logic for the Web-application

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
"use strict";

// Import export with ES6 modules
import { fetchCalculatedData } from "./comms.mjs";
import { fetchProfile, fetchTeam, fetchActivity, fetchInterest, fetchAllInterests, fetchAllTeams, fetchAllActivitiesFromInterest, fetchAllProfilesFromTeam } from "./comms.mjs";
import { postProfile, postTeam, postActivity, postInterest  } from "./comms.mjs";

// Variables
let currentProfileObj = null;
let currentProfileUsername = null;
let currentTeamObj = null;
let currentTeamIdName = null;
let allTeamsObj = null;
let currentTimeObj = null;
let currentTimeId = null;


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


// HTML DOM NAV functions

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


// HTML DOM initial update functions

// DOM update when entering
function initialDOMUpdate() {
    initialInterestDOMUpdate();
    console.log("initialInterestDOMUpdate: Done");
}

// Create checkbox for activity under interest heading
function createCheckbox(activities, activity, interestHeading) {
    // Create input checkbox and label elements for each activity
    const inputCheckbox = document.createElement("input");
    const label = document.createElement("label");
    const br = document.createElement("br");

    // Set attributes for checkbox and label
    inputCheckbox.type = "checkbox";
    inputCheckbox.id = activity + "_id";
    inputCheckbox.name = activity;// + "_name";
    //inputCheckbox.value = activity;
    label.htmlFor = activity + "_id";
    label.textContent = activities[activity].name;
    label.title = activities[activity].description;
    
    // Append checkbox and label after the interest heading
    interestHeading.after(br);
    interestHeading.after(label);
    interestHeading.after(inputCheckbox);
}

// Initial update for DOM with data gatehred from server
// - Genereate all interests and activities in the interest form
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


// HTML DOM update functions

// Function update the DOM with the profile data
function updateProfileInfoDOM() {
    console.log("updateProfileInfoDOM: ", currentProfileUsername, currentProfileObj, currentTeamObj);
    // Get the profile section
    const nameSpan = document.getElementById("profile_name_span_id");
    const idSpan = document.getElementById("profile_username_span_id");
    const teamSpan = document.getElementById("team_name_span_id");
    const teamIdSpan = document.getElementById("team_id_name_span_id");
    const teamTimeSpan = document.getElementById("team_time_span_id");

    // Update the profile section with the profile data
    nameSpan.textContent = currentProfileObj["name"];
    idSpan.textContent = currentProfileUsername;
    teamSpan.textContent = currentProfileObj["name"];
    teamIdSpan.textContent = currentTeamIdName;
    teamTimeSpan.textContent = currentTeamObj["time_frame"]["from"] + " - " + currentTeamObj["time_frame"]["to"];
}

// Function update the DOM with the interest data
function updateInterestDOM() {
    // Get all interested activities for the profile
    const interestedActivities = currentProfileObj["activity_ids"];

    // Loop though all checkboxes and uncheck them
    const checkboxes = document.querySelectorAll("#interests_form input[type='checkbox']");
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });

    // Loop through profiles interested activities and check the checkboxes
    interestedActivities.forEach(activity => {
        const checkbox = document.getElementById(activity+"_id");
        // if checkbox exists, check it
        if (checkbox) {
            checkbox.checked = true;
        }
    });

    //console.log("updateInterestDOM: checkboxes", checkboxes, "interestedActivities", interestedActivities);
}


// HTML forms

// POST interested activities form handler
function postProfileFormHandler(event, key) {
    event.preventDefault();
    const form = event.target; // Get the form from the event target element (the interest form)
    const formData = new FormData(form); // Get all form data
    const checkedData = [];

    console.log(event.target);
    console.log(formData);
    // Loop through all checkboxes and add checked data ids to array
    for (const checkbox of formData) {
        if (checkbox[1] === "on") {
            checkedData.push(checkbox[0]);
            console.log(checkbox);
        }
    }

    // Update the current profile object with the checked data
    currentProfileObj[key] = checkedData;
    
    // combine object and id for a full profile object that is sendt to the server
    const fullProfileObj = {
        [currentProfileUsername]: currentProfileObj
    };
    
    console.log(fullProfileObj);

    // Post the updated profile object to the server
    postProfile(currentProfileUsername, fullProfileObj);
}


// Login form handler
async function loginWithIdUpdateHandler(event) {
    event.preventDefault();
    currentProfileUsername = event.target.username.value;
    currentProfileObj = await fetchProfile(currentProfileUsername);
    allTeamsObj = await fetchAllTeams();

    
    // Find team that the profile is a part of
    for (const team in allTeamsObj) {
        if (allTeamsObj[team].profile_ids.includes(currentProfileUsername)) {
            currentTeamObj = allTeamsObj[team];
            currentTeamIdName = team;
            break;
        }
    }
    
    // Update the DOM with the profile data
    updateProfileInfoDOM(); 
    updateInterestDOM();

    //console.log("loginWithIdUpdateHandler: ", currentProfileId, currentProfileObj);
}

// POST (and update) Team timeframe form handler
function teamTimeframeFromHandler(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const teamTimeframe = {
        from: formData.get("timeframe_from"),
        to: formData.get("timeframe_to")
    };
    //console.log("teamTimeframeFromHandler: ", teamTimeframe);

    currentTeamObj["time_frame"] = teamTimeframe;
    const fullTeamObj = {
        [currentTeamIdName]: currentTeamObj
    };

    postTeam(currentTeamIdName, fullTeamObj);
    createAvailableTimeForm(teamTimeframe.from, teamTimeframe.to);
}



// HTML Event listeners

// Attach the event listener to each nav button
const navButtons = document.querySelectorAll("nav button"); // Get all nav buttons
navButtons.forEach(button => {
    button.addEventListener("click", navButtonHandler);
});

// Attach the event listener to the login  with id from
const loginForm = document.getElementById("profile_login_username_form_id")
loginForm.addEventListener("submit", loginWithIdUpdateHandler);

const teamTimeframeFrom = document.getElementById("team_timeframe_form_id");
teamTimeframeFrom.addEventListener("submit", teamTimeframeFromHandler);

// Attach the event listener to the interests form
const interestsForm = document.getElementById("interests_form");
interestsForm.addEventListener("submit", (event) => {
    postProfileFormHandler(event,"activity_ids"); 
});

const availableTimeForm = document.getElementById("time_picker_form_id");
availableTimeForm.addEventListener("submit", (event) => {
    postProfileFormHandler(event,"time_availability"); 
});


// Update/create DOM on page load
initialDOMUpdate();









//Alt kode vedrørende available time


// Function Called to create or update the available time form
function createAvailableTimeForm (startDate, endDate){
    startDate = new Date(startDate);
    endDate = new Date(endDate);
    const numberOfDays = countDays(startDate, endDate);
    const form = document.getElementById("time_picker_form_id");

    for (let i = form.children.length - 1; i >= 0; i--) {
        if (form.children[i].tagName === "DIV") {
            //console.log(form.children[i]);
            form.removeChild(form.children[i]);
        }
    }

    for (let i = 0; i <= numberOfDays; i++) {                                        // Looper gennem alle dagene for at lave checkboxene for hver dag   
        createCheckboxes(startDate);
        startDate.setDate(startDate.getDate() + 1)                                                        // Add 1 to today's date and set it to tomorrow
    }
}

// Helper function to count days between two dates
function countDays (startDate, endDate) {
    //startDate er et dato objekt (new Date()) og det samme er endDate
    let differenceInTime = endDate.getTime() - startDate.getTime();

    let differenceInDays = Math.round(differenceInTime / (1000 * 3600 * 24));

    return differenceInDays;
}

// functio nfor making the headers and checkboxes for the available time form, for a specific day
// Function til at lave checkboxes for specifikke dage
function createCheckboxes(date) {
    // Array for timer
    const hours = ["8-9", "9-10", "10-11", "11-12", "12-13", "13-14", "14-15", "15-16", "16-17", "17-18", "18-19", "19-20", "20-21", "21-22", "22-23"];
    let day = date.toLocaleString('en-GB', {weekday : "long"});
    let dateString = date.toLocaleDateString('en-GB');

    const fromSubmitBtn = document.querySelector("#time_picker_form_id input[type='submit']");
    const container = document.createElement("div");
    const heading = document.createElement("h2");                                                      //giver div className ift ugedagene så fx "Monday"
    //const ul = document.createElement("ul");                                                           //laver et ul i dokumentet
    
    //container.className = day.toLowerCase();                                                           //Assuming class name is lowercase (få days til lower case letters)
    
    heading.textContent = day + " - " + date.toLocaleDateString();
    container.appendChild(heading);
                                                //tilføjer et className til ul som hedder chackbox_ samt dagen man er på

    for (let i = 0; i < hours.length; i++) {                                                           //forloop det løber for de timer man har tilføjet til arrayet hours.
      checkboxContents(container, dateString, hours[i]);
    }
                                                                        //tilføjer ul-delen til container elementet
    fromSubmitBtn.before(container);                                                                   //tilføjer container-delen itl selve documentet i "body".
}

// Function to create induvidual checkboxes for the available time form
function checkboxContents (container, dateString, hour) {
    //const li = document.createElement("li");                                                         //creater et li for hver hour der er i arrayet hours.
    const checkbox = document.createElement("input"); 
    const label = document.createElement("label");                                                   //creater nyt på domuentet. Et label                                                                                             //tilføjer et input under "li".
    
    checkbox.type = "checkbox";
    checkbox.classList += "time_chk_btn";                                                                      //tilføjer elementtypen "type" med værdien "checkbox" for alle tidspunkter.
    checkbox.id = dateString + "_" + hour.replace("-", "_") + "_id";                                     //slicer navnet på dagen over så det kun er første 3 man ser                                                                                          //tilføjer et "_" og bagefter tidspunktet der bruges.
    checkbox.name = dateString + "_" + hour.replace("-", "_");                                   //samme som før
    
    label.htmlFor = dateString + "_" + hour.replace("-", "_") + "_id";                                   //efter label indsætter man html for værdien af label
    label.textContent = hour;                                                                    //det tidspunkt der skal stå på knappen.
    
    container.appendChild(checkbox);                                                                        //tilføjer hele checkbox delen til li
    container.appendChild(label);                                                                           //tilføjer bagefter labet til li-delen                                                                            //tilføjer li-delen til ul-delen   
}


function updateAvailableTimeDOM () {
    const availableTimes = null; 
}


function submitAvailableTimeFormHandler(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const checkedTime = [];

    for(const checkbox of formData) {
        if(checkbox.checked) {
            checkedTime.push(checkbox.name);
        }
    }

    currentTimeObj["time_availability"] = checkedTime;

    const fullTimeObj = {
        [currentProfileUsername]: currentProfObj
    };

    console.log(fullTimeObj);

    // Post the updated profile object to the server
    postProfile(currentProfileUsername, fullProfileObj);
}

