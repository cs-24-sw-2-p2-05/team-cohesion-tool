// INFO:
// This file contains feching functions for the client-side logic of the Web-application

// Import export with ES6 modules
export { fetchCalculatedData, fetchProfile, fetchTeam, fetchActivity, fetchInterest, fetchAllInterests, fetchAllTeams, fetchAllActivitiesFromInterest, fetchAllProfilesFromTeam };

// Log JSON data to console
function consoleLogJSONData(data) {
    Object.keys(data).forEach(key => { console.log(key + ": " + data[key]); });
}

// Fetch JSON data from server
function verifyJson(response) {
    if (response.ok) {
        if (response.headers.get('Content-Type').includes('application/json')) {
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
    //console.log("parseJson: " + url);
    return fetch(url)
    .then(verifyJson)
    .then(data => {
        console.log("Fetched: " + url + ": " + data);
        //consoleLogJSONData(data);
        return data;
    })
    .catch(error => { console.error("fetch: " + url + profileNumber + ": " + error); });
}

// POST a JSON object to the server, thus adding or updating data in the database
function postJson(url, data) {
    //console.log("postJson: " + url);
    const fetchoptions = {
        method: 'POST',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }

    return fetch(url, fetchoptions);
}


// fetch helper function to get calculated data from server
function fetchCalculatedData(teamNumber) {
    return getJson("/teams/" + teamNumber + "/calculate");
}


// A lot of fetch helper functions to get data from the server

// Fetch profile data from server
function fetchProfile(profileNumber) {
    console.log("fetchProfile: " + profileNumber);
    return getJson("/profiles/" + profileNumber);
}

// Fetch team data from server
function fetchTeam(teamNumber) {
    console.log("fetchTeam: " + teamNumber);
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

// Fetch all activities data in relation to an interest from server
function fetchAllActivitiesFromInterest(interestNumber) {
    return getJson("/activities" + "/interests/" + interestNumber);
}

// Fetch all profiles data in relation to a team from server
function fetchAllProfilesFromTeam(teamNumber) {
    return getJson("/profiles" + "/teams/" + teamNumber);
}
