// INFO:
// This file contains the main client-side logic for the Web-application

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
"use strict";

// Import export with ES6 modules
import { fetchCalculatedData } from "./comms.mjs";
import { fetchProfile, fetchTeam, fetchActivity, fetchInterest, fetchAllInterests, fetchAllTeams, fetchAllActivitiesFromInterest, fetchAllProfilesFromTeam } from "./comms.mjs";
import { postProfile, postTeam, postActivity, postInterest  } from "./comms.mjs";

// Global variables
let currentProfileObj = null;
let currentProfileUsername = null;
let currentTeamObj = null;
let currentTeamIdName = null;
let allTeamsObj = null;


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


// Avaiable time section DOM and fetch functions

// Function Called to create or update the available time form
function generateAvailableTimeForm() {
    let startDate = new Date(0);
    let endDate = new Date(0);

    // check if team loaded and has a timeframe
    if (currentTeamObj !== null 
        && (currentTeamObj.time_frame.from !== "") 
        && (currentTeamObj.time_frame.to !== "")) {

        startDate = new Date(currentTeamObj.time_frame.from);
        endDate = new Date(currentTeamObj.time_frame.to);
    }
    
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
    const day = date.toLocaleString('en-GB', {weekday : "long"});
    const dateString = date.toISOString().substring(0, 10);

    const fromSubmitBtn = document.querySelector("#time_picker_form_id input[type='submit']");
    const container = document.createElement("div");
    const heading = document.createElement("h2");
    
    heading.textContent = day + " - " + date.toLocaleDateString();
    container.appendChild(heading);

    for (let i = 0; i < hours.length; i++) {                                                           //forloop det løber for de timer man har tilføjet til arrayet hours.
      checkboxContents(container, dateString, hours[i]);
    }

    fromSubmitBtn.before(container);                                                                   //tilføjer container-delen itl selve documentet i "body".
}

// Function to create induvidual checkboxes for the available time form
function checkboxContents (container, dateString, hour) {
    const checkbox = document.createElement("input"); 
    const label = document.createElement("label");                                                       //creater nyt på domuentet. Et label                                                                                             //tilføjer et input under "li".
    
    checkbox.type = "checkbox";
    checkbox.classList += "time_chk_btn";                                                                //tilføjer elementtypen "type" med værdien "checkbox" for alle tidspunkter.
    checkbox.id = dateString + "_" + hour.replace("-", "_") + "_id";                                     //slicer navnet på dagen over så det kun er første 3 man ser                                                                                          //tilføjer et "_" og bagefter tidspunktet der bruges.
    checkbox.name = dateString + "_" + hour.replace("-", "_");                                           //samme som før
    
    label.htmlFor = dateString + "_" + hour.replace("-", "_") + "_id";                                   //efter label indsætter man html for værdien af label
    label.textContent = hour;                                                                    //det tidspunkt der skal stå på knappen.
    
    container.appendChild(checkbox);                                                                        //tilføjer hele checkbox delen til container
    container.appendChild(label);                                                                           //tilføjer bagefter labet til container-delen                                                                            //tilføjer li-delen til ul-delen   
}


// Interest section DOM and fetch functions

// Create checkbox for activity under interest heading
function createActivityCheckbox(activities, activity, interestHeading) {
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
                    createActivityCheckbox(activities, activity, interestHeading);
                }
            });
        }
    });
}


// HTML DOM update functions

// Function update the DOM with the profile data
function updateInfoDOM() {
    //console.log("updateProfileInfoDOM: ", currentProfileUsername, currentProfileObj, currentTeamObj);
    // Get the profile section
    const nameSpan = document.getElementById("profile_name_span_id");
    const idSpan = document.getElementById("profile_username_span_id");
    const teamSpan = document.getElementById("team_name_span_id");
    const teamIdSpan = document.getElementById("team_id_name_span_id");
    const teamTimeSpan = document.getElementById("team_time_span_id");

    // Update the profile section with the profile data
    nameSpan.textContent = currentProfileObj["name"];
    idSpan.textContent = currentProfileUsername;
    // Only update if they have a team
    if (currentTeamObj !== null) {
        teamSpan.textContent = currentTeamObj["name"];
        teamIdSpan.textContent = currentTeamIdName;
        teamTimeSpan.textContent = currentTeamObj["time_frame"]["from"] + " - " + currentTeamObj["time_frame"]["to"];
    } else {
        teamSpan.textContent = "No team";
        teamIdSpan.textContent = "No team";
        teamTimeSpan.textContent = "No team";
    }
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

// Function update the DOM with the available time data
function updateAvailableTimeDOM () {
    //Get all last available times for the profile
    const availableTimes = currentProfileObj["time_availability"]; 

    //Select all checkboxes and uncheck them
    const checkboxesTime = document.querySelectorAll("#time_picker_form_id[type = 'checkbox']");
    checkboxesTime.forEach(checkbox => {
        checkbox.checked = false;
    });

    availableTimes.forEach(time =>{
        const checkboxTime = document.getElementById(time+"_id");
        if (checkboxTime) {
            checkboxTime.checked = true;
        }
    })
}


// HTML form event handlers

// Login form handler
async function loginEventHandler(event) {
    event.preventDefault();
    currentProfileUsername = event.target.username.value;
    currentProfileObj = await fetchProfile(currentProfileUsername);
    allTeamsObj = await fetchAllTeams();

    
    // Find team that the profile is a part of, if no team, null
    for (const team in allTeamsObj) {
        if (allTeamsObj[team].profile_ids.includes(currentProfileUsername)) {
            currentTeamObj = allTeamsObj[team];
            currentTeamIdName = team;
            break;
        } else {
            currentTeamObj = null;
            currentTeamIdName = null;
        }
    }
    
    // Update the DOM with the profile data
    updateInfoDOM(); 
    updateInterestDOM();
    generateAvailableTimeForm();
    updateAvailableTimeDOM();

    // Change navigation tab
    showSelection("profile_and_team_section_id");
    //console.log("loginWithIdUpdateHandler: ", currentProfileId, currentProfileObj);
}

// Create and POST profile form handler
function createProfileFormEventHandler(event) {
    event.preventDefault();
    // Get the form from the event target element (the profile form)
    const form = event.target;
    const formData = new FormData(form);

    // Create a profile object from the form data
    const profile = {
        name: formData.get("name"),
        activity_ids: [],
        time_availability: []
    };

    // Combine object and id for a full profile object
    const profileUsername = formData.get("username");
    const fullProfileObj = {
        [profileUsername]: profile
    };

    // Post the profile object to the server
    postProfile(profileUsername, fullProfileObj);
    
    // Update global variables and the user DOM
    currentProfileUsername = profileUsername;
    currentProfileObj = profile;
    currentTeamIdName = null;
    currentTeamObj = null;
    updateInfoDOM();
    updateInterestDOM();
    generateAvailableTimeForm();
    updateAvailableTimeDOM();

    // Change navigation tab
    showSelection("profile_and_team_section_id");
}

// Create and POST team form handler
function createTeamFormEventHandler(event) {
    event.preventDefault();
    // Get the form from the event target element (the team form)
    const form = event.target;
    const formData = new FormData(form);

    // Create a team object from the form data
    const NewTeamObj = {
        name: formData.get("name"),
        profile_ids: [currentProfileUsername],
        time_frame: {
            from: "",
            to: ""
        }
    };

    // Remove the profile id from the old team object
    if (currentTeamObj !== null) {
        const updateOldTeamObjProfileIds = currentTeamObj.profile_ids.filter(username => username !== currentProfileUsername);
        const updateOldTeamObj = {   
            [currentTeamIdName]: { profile_ids: updateOldTeamObjProfileIds }
        };
        //console.log("assignProfileToTeamFormHandler: ", updateOldTeamObj);
        postTeam(currentTeamIdName, updateOldTeamObj);
    }

    // Combine object and id for a full team object
    const teamIdName = formData.get("id_name");
    const fullTeamObj = {
        [teamIdName]: NewTeamObj
    };
    
    // Post the team object to the server
    postTeam(teamIdName, fullTeamObj);

    // Update global variables and the relevant things in DOM
    currentTeamObj = NewTeamObj;
    currentTeamIdName = teamIdName;
    updateInfoDOM();
    generateAvailableTimeForm();
    updateAvailableTimeDOM();
}

// Assign profile to team and POST form handler
async function assignProfileToTeamFormEventHandler(event) {
    event.preventDefault();
    // Get the form from the event target element (the assign profile to team form)
    const form = event.target;
    const formData = new FormData(form);

    // Get the profile and team id names
    const teamIdName = formData.get("id_name");

    // Get the team object from the server
    let serverTeamObj = await fetchTeam(teamIdName);

    // Add the profile id to the new team object, and remove duplicates
    serverTeamObj.profile_ids.push(currentProfileUsername);
    const fullTeamObj = {
        [teamIdName]: { profile_ids: [...new Set(serverTeamObj.profile_ids)] } // set removes duplicates
    };

    // Remove the profile id from the old team object
    if (currentTeamObj !== null) {
        const updateOldTeamObjProfileIds = currentTeamObj.profile_ids.filter(username => username !== currentProfileUsername);
        
        // Update the old team object with the new profile ids
        let updateOldTeamObj = { [currentTeamIdName]: { profile_ids: updateOldTeamObjProfileIds } };

        // If the old team is empty, delete the team
        if (updateOldTeamObjProfileIds.length === 0) {
            updateOldTeamObj = { [currentTeamIdName]: {} };
        }
        
        //console.log("assignProfileToTeamFormHandler: ", updateOldTeamObj);
        postTeam(currentTeamIdName, updateOldTeamObj);
    }

    // Post the updated team object to the server
    postTeam(teamIdName, fullTeamObj);

    // Update global variables and the relevant things in DOM
    currentTeamObj = serverTeamObj;
    currentTeamIdName = teamIdName;
    updateInfoDOM();
    generateAvailableTimeForm();
    updateAvailableTimeDOM();
}

// POST and update Team timeframe form handler
function teamTimeframeFromEventHandler(event) {
    event.preventDefault();
    // alert if no team to update timeframe for
    if (currentTeamObj === null) {
        alert("No team to update timeframe for");
    }
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
    updateInfoDOM();
    generateAvailableTimeForm();
    updateAvailableTimeDOM();
}

// POST interested activities form handler
function postProfileFormEventHandler(event, key) {
    event.preventDefault();
    const form = event.target; // Get the form from the event target element (the interest form)
    const formData = new FormData(form); // Get all form data
    const checkedData = [];

    //console.log(event.target);
    //console.log(formData);
    // Loop through all checkboxes and add checked data ids to array
    for (const checkbox of formData) {
        if (checkbox[1] === "on") {
            checkedData.push(checkbox[0]);
            //console.log(checkbox);
        }
    }

    // Update the current profile object with the checked data
    currentProfileObj[key] = checkedData;
    
    // combine object and id for a full profile object that is sendt to the server
    const fullProfileObj = {
        [currentProfileUsername]: currentProfileObj
    };
    
    //console.log(fullProfileObj);

    // Post the updated profile object to the server
    postProfile(currentProfileUsername, fullProfileObj);
}

// Function to update the team activity results
async function teamActivityResults() {
    const ranked_activities = await fetchCalculatedData(currentTeamIdName);    
    console.log("teamActivityResults for team: ", currentTeamIdName);
    console.log("teamActivityResults: ", ranked_activities);
    resultSide(ranked_activities);
}


// HTML Event listeners

// Attach the event listener to each nav button
const navButtons = document.querySelectorAll("nav button"); // Get all nav buttons
navButtons.forEach(button => {
    button.addEventListener("click", navButtonHandler);
});

// Attach the event listener to the login  with id from
const loginForm = document.getElementById("profile_login_username_form_id")
loginForm.addEventListener("submit", loginEventHandler);

// Attach the event listener to the create new profile form
const createNewProfileForm = document.getElementById("profile_create_form_id");
createNewProfileForm.addEventListener("submit", createProfileFormEventHandler);

// Attach the event listener to the create new team form
const createNewTeamForm = document.getElementById("team_create_form_id");
createNewTeamForm.addEventListener("submit", createTeamFormEventHandler);

// Attach the event listener to the assing profile to team form
const assignProfileToTeamForm = document.getElementById("team_profile_assign_id_name_form_id");
assignProfileToTeamForm.addEventListener("submit", assignProfileToTeamFormEventHandler);

// Attach the event listener to the team timeframe form
const teamTimeframeFrom = document.getElementById("team_timeframe_form_id");
teamTimeframeFrom.addEventListener("submit", teamTimeframeFromEventHandler);

// Attach the event listener to the interests form
const interestsForm = document.getElementById("interests_form");
interestsForm.addEventListener("submit", (event) => {
    postProfileFormEventHandler(event,"activity_ids"); 
});

const availableTimeForm = document.getElementById("time_picker_form_id");
availableTimeForm.addEventListener("submit", (event) => {
    postProfileFormEventHandler(event,"time_availability"); 
});

// Attach the event listener to the plan-team-activities button
const teamActivityResutlsBtn = document.getElementById("team_results_btn_id");
teamActivityResutlsBtn.addEventListener("click", teamActivityResults);




// Genereate elements for DOM on page load
initialDOMUpdate();

/* //making sure the button only can be pressed once
const listenOnce = (el, evt, fn) =>
    el.addEventListener(evt, fn, { once: true });

listenOnce(document.getElementById("team_results_btn_id"), 'click', resultSide);
 */
//document.getElementById("team_results_btn_id").addEventListener("click", resultSide);

//resultatsiden
function resultSide(ranked_activities){
    // create elements for showing the results
    const container = document.getElementById("mah_results_id");
    const heading = document.createElement("h2");
    const result = document.createElement("P");
    const result_info = document.createElement("P");

    // remove previous results
    container.innerHTML = "";
    
    heading.textContent = "Suggested activity for your team!";
    container.append(heading);
    result.id = "activity_todo";
    result_info.id = "activity_info_todo";

    let act = Object.keys(ranked_activities[0].scored_activities[0]); //dette er saadan man finder id paa aktiviteten der skal anbefales.
    let newString = act.toString();
    let split = newString.split('activity_id')[1];
    let users = Object.values(ranked_activities[0].users);
    let fetch = fetchActivity(split); //fetch the activity from database
    
    fetch.then(fetchedObject => {
        let nameString = fetchedObject.name.toString(); // Convert the name attribute to a string
        let timeString = fetchedObject.time_interval.toString();
        
        result.innerHTML = nameString + "<br>"                   //+result from ActivitySuggester;
        
        result_info.innerHTML = "Activity duration: " + timeString + " hours" + "<br><br>"                               //+time from JSON file
        + "Team members available: " + users + "<br><br>"                       //+result from ActivitySuggester;
        + "Available timespan for participants:    " + "The hours  " + getFirstHour(ranked_activities) + " - " + getLastHour(ranked_activities) + " on " + newGetDate(ranked_activities) + "<br><br>";    //+result from ActivitySuggester;
        
        container.append(result);
        container.append(result_info);
    });

}

function getFirstHour(arraytest) {
    let firstTime = arraytest[0].interval_list[0];
    //console.log(firstTime);

    let firstHour = firstTime.split('_')[1];
    //console.log(firstHour);

    return firstHour.toString();
}

function getLastHour(arraytest) {
    let length = arraytest[0].interval_list.length;
    
    let lastTime = arraytest[0].interval_list[length-1];
    //console.log(lastTime);

    let lastHour = lastTime.split('_')[2];
    //console.log(lastHour);

    return lastHour.toString();
}

function newGetDate(arraytest){
    let date = arraytest[0].interval_list[0];

    let dateSplit = date.split('_')[0];

    // Split the date into year, month, and day
    let year = dateSplit.split('-')[0];
    let month = dateSplit.split('-')[1];
    let day = dateSplit.split('-')[2];

    // Initialize dateSplit as a Date object
    let newDateSplit = new Date(year, month - 1, day); // Month in Date object is 0-indexed, so subtract 1 from the month

    // Format the date as "dd MonthName yyyy"
    let localDate = newDateSplit.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });

    return localDate;
}
    

    

async function resultSideRefactored(ranked_activities){
    const best_rank = ranked_activities[0];

    // create elements for showing the results
    const container = document.getElementById("mah_results_id");
    const heading = document.createElement("h2");
    const result = document.createElement("P");
    const result_info = document.createElement("P");

    // remove previous results
    container.innerHTML = "";

    // add new results

    // title
    heading.textContent = "Suggested activity for your team!";
    container.append(heading);

    // fetch and create info about the best activity
    const best_activity = await fetchActivity(best_rank.scored_activities[0].activity_id.split("activity_id")[1]);
    result.innerHTML = best_activity.name + "<br>";
    result_info.innerHTML = "Activity duration: " + best_activity.time_interval + " hours" + "<br>"
    + "Team members available: " + best_rank.users + "<br>"
    + "Available timespan for participants:    " + " In the hours  " + getFirstHour(ranked_activities) + " - " + getLastHour(ranked_activities) + " on " + newGetDate(ranked_activities) + "<br>";
    container.appendChild(heading)
    container.appendChild(result);
    container.appendChild(result_info);
}