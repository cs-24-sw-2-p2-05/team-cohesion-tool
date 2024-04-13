// INFO:
// This file contains feching functions for the client-side logic of the Web-application

// Import export with ES6 modules
export { fetchProfile, fetchTeam, fetchActivity, fetchInterest, fetchAllInterests, fetchAllTeams, fetchAllActivitiesFromInterest, fetchAllProfilesFromTeam };

// Log JSON data to console
function consoleLogJSONData(data) {
    Object.keys(data).forEach(key => { console.log(key + ": " + data[key]); });
}

// Fetch JSON data from server
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

// Parse JSON data from server
function parseJson(url) {
    console.log("parseJson: " + url);
    return fetchJson(url)
    .then(data => {
        console.log("Fetched: " + url + ": " + data);
        consoleLogJSONData(data);
        return data;
    })
    .catch(error => { console.error("fetchProfile: " + profileNumber + ": " + error); });
}

// A lot of fetch helper functions to get data from the server

// Fetch profile data from server
function fetchProfile(profileNumber) {
    console.log("fetchProfile: " + profileNumber);
    return parseJson("/profiles/" + profileNumber);
}

// Fetch team data from server
function fetchTeam(teamNumber) {
    console.log("fetchTeam: " + teamNumber);
    return parseJson("/teams/" + teamNumber);
}

// Fetch activity data from server
function fetchActivity(activityNumber) {
    return parseJson("/activities/" + activityNumber);
}

// Fetch interest data from server
function fetchInterest(interestNumber) {
    return parseJson("/interests/" + interestNumber);
}

// Fetch all interests data from server
function fetchAllInterests() {
    return parseJson("/interests");
}

// Fetch all teams data from server
function fetchAllTeams() {
    return parseJson("/teams");
}

// Fetch all activities data in relation to an interest from server
function fetchAllActivitiesFromInterest(interestNumber) {
    return parseJson("/activities" + "/interests/" + interestNumber);
}

// Fetch all profiles data in relation to a team from server
function fetchAllProfilesFromTeam(teamNumber) {
    return parseJson("/profiles" + "/teams/" + teamNumber);
}
