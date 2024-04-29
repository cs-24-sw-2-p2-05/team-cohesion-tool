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
let currentProfileId = null;
let currentTeamObj = null;
let currentTeamId = null;
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
    // Get the profile section
    const nameSpan = document.getElementById("profile_name_span_id");
    const idSpan = document.getElementById("profile_id_span_id");
    const teamSpan = document.getElementById("team_name_span_id");
    const teamIdSpan = document.getElementById("team_id_span_id");
    const teamTimeSpan = document.getElementById("team_time_span_id");

    // Update the profile section with the profile data
    nameSpan.textContent = currentProfileObj["name"];
    idSpan.textContent = currentProfileId;
    teamSpan.textContent = currentProfileObj["name"];
    teamIdSpan.textContent = currentTeamId;
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

    console.log("updateInterestDOM: checkboxes", checkboxes, "interestedActivities", interestedActivities);
}


// HTML forms

// POST interested activities form handler
function postInterestsFormHandler(event) {
    event.preventDefault();
    const form = event.target; // Get the form from the event target element (the interest form)
    const formData = new FormData(form); // Get all form data
    const checkedActivities = [];

    // Loop through all checkboxes and add checked activity ids to array
    for (const checkbox of formData) {
        if (checkbox[1] === "on") {
            checkedActivities.push(checkbox[0]);
        }
    }

    // Update the current profile object with the checked activities
    currentProfileObj["activity_ids"] = checkedActivities;
    
    // combine object and id for a full profile object that is sendt to the server
    const fullProfileObj = {
        [currentProfileId]: currentProfileObj
    };
    
    console.log(fullProfileObj);

    // Post the updated profile object to the server
    postProfile(currentProfileId.split("profile_id")[1], fullProfileObj);
}


// Login form handler
async function loginWithIdUpdateHandler(event) {
    event.preventDefault();
    currentProfileId = event.target.profile_id.value;
    currentProfileObj = await fetchProfile(currentProfileId.split("profile_id")[1]);
    allTeamsObj = await fetchAllTeams();

    
    // Find team that the profile is a part of
    for (const team in allTeamsObj) {
        if (allTeamsObj[team].profile_ids.includes(currentProfileId)) {
            currentTeamObj = allTeamsObj[team];
            currentTeamId = team;
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
    console.log("teamTimeframeFromHandler: ", teamTimeframe);

    currentTeamObj["time_frame"] = teamTimeframe;
    const fullTeamObj = {
        [currentTeamId]: currentTeamObj
    };

    postTeam(currentTeamId.split("team_id")[1], fullTeamObj);
    createAvailableTimeForm(teamTimeframe.from, teamTimeframe.to);
}



// HTML Event listeners

// Attach the event listener to each nav button
const navButtons = document.querySelectorAll("nav button"); // Get all nav buttons
navButtons.forEach(button => {
    button.addEventListener("click", navButtonHandler);
});

// Attach the event listener to the login  with id from
const loginFormId = document.getElementById("profile_login_id_form_id")
loginFormId.addEventListener("submit", loginWithIdUpdateHandler);

const teamTimeframeFrom = document.getElementById("team_timeframe_form_id");
teamTimeframeFrom.addEventListener("submit", teamTimeframeFromHandler);

// Attach the event listener to the interests form
const interestsForm = document.getElementById("interests_form");
interestsForm.addEventListener("submit", postInterestsFormHandler);



// Update/create DOM on page load
initialDOMUpdate();









//Alt kode vedrørende available time
/* let startDate = new Date();
let endDate = new Date();
endDate.setDate(endDate.getDate() + 10)

createAvailableTimeForm (startDate, endDate); */

// Function Called to create or update the available time form
function createAvailableTimeForm (startDate, endDate){
    startDate = new Date(startDate);
    endDate = new Date(endDate);
    for (let i = 0; i < countDays(startDate, endDate); i++) {                                           // Looper gennem alle dagene for at lave checkboxene for hver dag
        createCheckboxes(startDate);
        startDate.setDate(startDate.getDate() + 1)                                                        // Add 1 to today's date and set it to tomorrow
}}

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
  const ul = document.createElement("ul");                                                           //laver et ul i dokumentet
  
  container.className = day.toLowerCase();                                                           //Assuming class name is lowercase (få days til lower case letters)
  
  heading.textContent = day + " - " + date.toLocaleDateString();
  container.appendChild(heading);

  ul.className = "checkbox_" + day.toLowerCase();                                                    //tilføjer et className til ul som hedder chackbox_ samt dagen man er på

  for (let i = 0; i < hours.length; i++) {                                                           //forloop det løber for de timer man har tilføjet til arrayet hours.
    checkboxContents(ul, dateString, hours[i]);
  }
  
  container.appendChild(ul);                                                                         //tilføjer ul-delen til container elementet
  fromSubmitBtn.before(container);                                                                   //tilføjer container-delen itl selve documentet i "body".
}

// Function to create induvidual checkboxes for the available time form
function checkboxContents (ul, dateString, hour) {
  const li = document.createElement("li");                                                         //creater et li for hver hour der er i arrayet hours.
    const checkbox = document.createElement("input"); 
    const label = document.createElement("label");                                                   //creater nyt på domuentet. Et label                                                                                             //tilføjer et input under "li".
    
    checkbox.type = "checkbox";                                                                      //tilføjer elementtypen "type" med værdien "checkbox" for alle tidspunkter.
    checkbox.id = dateString + "_" + hour.replace("-", "_");                                     //slicer navnet på dagen over så det kun er første 3 man ser                                                                                          //tilføjer et "_" og bagefter tidspunktet der bruges.
    checkbox.name = dateString + "_" + hour.replace("-", "_");                                   //samme som før
    checkbox.value = dateString + "_" + hour.replace("-", "_");
    
    label.htmlFor = dateString + "_" + hour.replace("-", "_");                                   //efter label indsætter man html for værdien af label
    label.textContent = hour;                                                                    //det tidspunkt der skal stå på knappen.
    
    li.appendChild(checkbox);                                                                        //tilføjer hele checkbox delen til li
    li.appendChild(label);                                                                           //tilføjer bagefter labet til li-delen
    ul.appendChild(li);                                                                              //tilføjer li-delen til ul-delen   
}



/* document.addEventListener("click", () => {
    const element = event.target;
    if (element.type === "checkbox") {
        console.log(`Checkbox ${element.id} is clicked ${element.value}`);
    }
}); */