// INFO:
// This file contains feching functions for the client-side logic of the Web-application

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
"use strict";

// Import export with ES6 modules
export { fetchCalculatedData }
export { fetchProfile, fetchTeam, fetchActivity, fetchInterest, fetchAllInterests, fetchAllTeams, fetchAllActivitiesFromInterest, fetchAllProfilesFromTeam };
export { postProfile, postTeam, postActivity, postInterest };

// Log JSON data to console
function consoleLogJSONData(data) {
    Object.keys(data).forEach(key => { console.log(key + ": " + data[key]); });
}

// Fetch JSON data from server
function verifyJson(response) {
    if (response.ok) {
        //console.log(response.headers.get("Content-Type"))
        if (response.headers.get("Content-Type").includes("application/json")) {
            return response.json();
        } else {
            throw new Error("Wrong content type, expected JSON");
        }
    } else {
        throw new Error(response.statusText);
    }
}

// GET and parse JSON data from server
function getJson(url) {
    return fetch(url)
    .then(verifyJson)
    .then(data => {
        //console.log("FetchGet: " + url + ": ", data);
        console.log("FetchGet: " + url);
        return data;
    })
    .catch(error => { console.error("FetchGet: " + url + ": " + error); });
}

// POST a JSON object to the server, thus adding or updating data in the database
function postJson(url, data) {
    const fetchoptions = {
        method: "POST",
        cache: "no-cache",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };
    return fetch(url, fetchoptions)
    .then(response => { 
        if (response.ok) { 
            return response.ok; 
        } else { 
            throw new Error(response.statusText); 
        } 
    })
    .then(data => {
        //console.log("FetchPost: " + url + ": ", data);
        console.log("FetchPost: " + url);
        return data;
    })
    .catch(error => { console.error("fetch: " + url + ": " + error); });
}


// fetch helper function to get calculated data from server
function fetchCalculatedData(teamNumber) {
    return getJson("/teams/" + teamNumber + "/calculate");
}


// A lot of fetch helper functions to get data from the server

// Fetch profile data from server
function fetchProfile(profileNumber) {
    //console.log("fetchProfile: " + profileNumber);
    return getJson("/profiles/" + profileNumber);
}

// Fetch team data from server
function fetchTeam(teamNumber) {
    //console.log("fetchTeam: " + teamNumber);
    return getJson("/teams/" + teamNumber);
}

// Fetch activity data from server
function fetchActivity(activityNumber) {
    return getJson("/activities/" + activityNumber);
}

// Fetch interest data from server
function fetchInterest(interestNumber) {
    return getJson("/interests/" + interestNumber);
}

// Fetch all interests data from server
function fetchAllInterests() {
    return getJson("/interests");
}

// Fetch all teams data from server
function fetchAllTeams() {
    return getJson("/teams");
}

// Fetch all activities data in relation to an main interest from server
function fetchAllActivitiesFromInterest(interestNumber) {
    return getJson("/activities" + "/interests/" + interestNumber);
}

// Fetch all profiles data in relation to a team from server
function fetchAllProfilesFromTeam(teamNumber) {
    return getJson("/profiles" + "/teams/" + teamNumber);
}


// fetch POST helper function to add or update data in the server

// Fetch POST profile data to server
function postProfile(profileNumber, data) {
    console.log("fetchProfile: " + profileNumber, data);
    return postJson("/profiles/" + profileNumber, data);
}

// Fetch POST team data to server
function postTeam(teamNumber, data) {
    console.log("fetchTeam: " + teamNumber, data);
    return postJson("/teams/" + teamNumber, data);
}

// Fetch POST activity data to server
function postActivity(activityNumber, data) {
    console.log("fetchActivity: " + activityNumber, data);
    return postJson("/activities/" + activityNumber, data);
}

// Fetch POST interest data to server
function postInterest(interestNumber, data) {
    console.log("fetchInterest: " + interestNumber, data);
    return postJson("/interests/" + interestNumber, data);
}
