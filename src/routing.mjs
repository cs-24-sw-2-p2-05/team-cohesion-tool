// INFO:
// This file contains the routing for the server

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
"use strict";

// Import export with ES6 modules
// Import module from node standard library
import fs from "fs";
// Import database. asserted as a json file
import database from "./db.json" with { type:"json"};
// Importing server app
import { app } from "./main.mjs";
// Import express routes
export { routes };
// Import object constructors
import { Profile, Team, Activity, Interest } from "./objects.mjs";

// The __dirname  = current/root directory
const __dirname = import.meta.dirname;

// Debugging, plz delete
import { activitySuggester, timerInterval, consecutiveTime, uniqueAndSort } from "./algorithm.mjs";
timerInterval(database["teams"]["team_id1"], database["profiles"]);



// Get data from JSON file, and make a response to client
function getInduvidualDataFromJSONFileWithResponse(type, id, res) {
    const data = database[type][id]; // Get the specific type of data, together with the key to get specific object in database (like a specific profile)
    if (data) {
        res.json(data);
    } else {
        res.status(404).send(`${type} with id: ${id} not found`);
    }
}

// Update the database with new data or delete, from POST request
// Returns response (res)
// TODO make work
function postUpdateDatabase(type, id, req) {
    const oldObject = null; // Get the old object from the database
    const newObject = null; // Get the new object from the request body
    const mergedObject = Object.assign({}, oldObject, newObject); // Merge the old object with the new object, new data overwiting old data

    // Delete if client update is empty, indicating that the object should be deleted
    // Else add or update the object
    if (Object.keys(newObject).length === 0) {
        delete database[type][type + id];
    } else {
        database[type][type + id] = mergedObject;
    }

    // Save database to file
    databaseWriteToFile();

    console.log(newObject + "\n\r");
    console.log(database[type]);

    // Return response
    return { message: `POST: ${type} added/altered successfully` }
}

// Function to write the database to a file
// TODO: Add better error handling
function databaseWriteToFile() {
    // Write the database to a file, with linebreaks
    fs.writeFile("./src/db.json", JSON.stringify(database, null, 4), (err) => {
        if (err) {
            console.error(err);
            return;
        } else {
            console.log("Database saved to file");
            return;
        }
    });
}

// Function to route the server, GET, POST, PUT, DELETE
function routes() {

    // GET routing

    // GET request to the root directory, which is the index.html file
    app.get("/", (req, res) => {
        res.sendFile("./public/html/index.html", { root: __dirname });
    });

    // GET routing for algorithm
    app.get("/teams/:teamIdName/calculate", (req, res) => {
        console.log("calculate request from team:", req.params.teamIdName);

        

    });

    // Database GET routing

    // Following routing mainly using route parameters to get specific data from the database
    // Routeing parametre like "/something/:parameter"

    // GET request to a specific profiles data
    // The profileId is passed as a parameter in the URL. ":profileUsername" is said parameter
    app.get("/profiles/:profileUsername", (req, res) => {
        // If the profile exists, else return a 404 status code with error
        getInduvidualDataFromJSONFileWithResponse("profiles", req.params.profileUsername, res);
    });

    // GET request to a specific teams data
    // The teamId is passed as a parameter in the URL. ":teamId" is said parameter
    app.get("/teams/:teamIdName", (req, res) => {
        // If the team exists, else return a 404 status code with error
        getInduvidualDataFromJSONFileWithResponse("teams", req.params.teamIdName, res);
    });

    // GET request to a specific activitys data
    // The activityId is passed as a parameter in the URL. ":activityId" is said parameter
    app.get("/activities/:activityId", (req, res) => {
        const activityId = "activity_id" + req.params.activityId; // Get the activityId from the request

        // If the activity exists, else return a 404 status code with error
        getInduvidualDataFromJSONFileWithResponse("activities", activityId, res);
    });

    // GET request to a specific interests data
    // The interestId is passed as a parameter in the URL. ":interestId" is said parameter
    app.get("/interests/:interestId", (req, res) => {
        const interestId = "interest_id" + req.params.interestId; // Get the interestId from the request

        // If the interest exists, else return a 404 status code with error
        getInduvidualDataFromJSONFileWithResponse("interests", interestId, res);
    });

    // Get request for all interests in database
    app.get("/interests", (req, res) => {
        const allInterests = database.interests;
        if (allInterests) {
            res.json(allInterests);
        } else {
            res.status(404).send("No interests found");
        }
    });

    // Get request for all teams in database
    app.get("/teams", (req, res) => {
        const allTeams = database.teams;
        if (allTeams) {
            res.json(allTeams);
        } else {
            res.status(404).send("No teams found");
        }
    });

    // Get request for all activities with spcific main interest
    app.get("/activities/interests/:interestId", (req, res) => {
        const interestId = "interest_id" + req.params.interestId; // Get the interestId from the request
        const allActivities = database.activities; // Get all activities from the database
        const relatedActivities = {} //= database.activities.filter(activity => activity.interest_id === interestId);

        // Check if the interest exists
        if (!database.interests[interestId]) {
            res.status(404).send(`No interest with id: ${interestId} found`);
        }

        // Loop though activities in the databse and match with activities from the selected interest
        for (const activityId in allActivities) {
            const activity = allActivities[activityId];

            // Add the activity to relatedActivities object if main interest is spesific interest
            if (activity.main_interest_id == interestId) {
                relatedActivities[activityId] = activity;
            }
        }

        // Send data if exists, else return a 404 status code
        if (relatedActivities) {
            res.json(relatedActivities);
        } else {
            res.status(404).send(`No activities related to the specified interest: ${interestId} found`);
        }
    });

    // Get request for all profiles in a team
    app.get("/profiles/teams/:teamIdName", (req, res) => {
        const teamIdName = req.params.teamIdName;
        const specificTeam = database.teams[teamIdName]; // Get the specific team, that we want to find all profiles for
        const allProfiles = database.profiles; // Get all profiles from the database
        const relatedProfiles = {} //= database.profiles.filter(profile => profile.team_id === teamId);
        
        // check if the team exists
        if (!specificTeam) {
            res.status(404).send(`No team with id: ${teamIdName} found`);
        }
        console.log(specificTeam);

        // Loop though profiles in the databse and match with profiles from the selected team
        for (const profileId in allProfiles) {
            const profile = allProfiles[profileId]; // Get the specific profile, that we want to check if is included in specific team

            // Append to selectedProfiles, if profile is part of a team
            if (specificTeam.profile_ids.includes(profileId)) {
                console.log(profile);
                relatedProfiles[profileId] = profile;
            }
        }

        // Send data if exists, else return a 404 status code
        if (relatedProfiles) {
            res.json(relatedProfiles);
        } else {
            res.status(404).send(`No profiles related to the specified team: ${teamIdName} found`);
        }
    });

    // POST routing

    // POST request to add a new profile or add to a profile to the database
    app.post("/profiles/:profileUsername", (req, res) => {
        const oldProfile = database.profiles[req.params.profileUsername];
        const newProfile = req.body[req.params.profileUsername];
        // Merge old profile with new profile, by overwriting old values with new values
        const mergedProfile = Object.assign({}, oldProfile, newProfile); 

        // Delete if client update is empty, indicating that the profile should be deleted
        // Else add or update the profile
       if (Object.keys(newProfile).length === 0) {
            delete database.profiles[req.params.profileUsername];
        } else { 
            database.profiles[req.params.profileUsername] = mergedProfile;
        }
        
        // Save database to file
        databaseWriteToFile();

        console.log(newProfile + "\n\r");
        console.log(database.profiles);

        const response = {
            message: "POST: Profile added/altered successfully",
        }
        res.status(200).json(response); // Send status code 200 back to client
    });

    // POST request to add a new team to the database, w/ attached profile
    // - Remove profile from old team
    app.post("/teams/:teamIdName", (req, res) => {
        const teamIdName = req.params.teamIdName;
        const oldTeam = database.teams[teamIdName];
        const newTeam = req.body[teamIdName];
        // Merge old team with new team, by overwriting old values with new values
        const mergedTeam = Object.assign({}, oldTeam, newTeam);

        // Delete if client update is empty, indicating that the team should be deleted
        // Else add or update the team
        if (Object.keys(newTeam).length === 0) {
            delete database.teams[teamIdName];
        } else {
            database.teams[teamIdName] = mergedTeam;
        }

        // Save database to file
        databaseWriteToFile();

        console.log(newTeam + "\n\r");
        console.log(database.teams);

        const response = { message: "POST: Team added/altered successfully" }
        res.status(200).json(response); // Send status code 200 back to client
    });

    // POST request to add a new activity to the database, w/ attached interest
    app.post("/activities/:activityId", (req, res) => {
        const oldActivity = database.activities["activity_id" + req.params.activityId];
        const newActivity = req.body["activity_id" + req.params.activityId];
        // Merge old activity with new activity, by overwriting old values with new values
        const mergedActivity = Object.assign({}, oldActivity, newActivity);

        // Delete if client update is empty, indicating that the activity should be deleted
        // Else add or update the activity
        if (Object.keys(newActivity).length === 0) {
            delete database.activities["activity_id" + req.params.activityId];
        } else {
            database.activities["activity_id" + req.params.activityId] = mergedActivity;
        }
        
        // Save database to file
        databaseWriteToFile();

        console.log(newActivity + "\n\r");
        console.log(database.activities);

        const response = { message: "POST: Activity added/altered successfully" }
        res.status(200).json(response); // Send status code 200 back to client
    });

    // POST request to add a new interest to the database
    app.post("/interests/:interestId", (req, res) => {
        const oldInterest = database.interests["interest_id" + req.params.interestId];
        const newInterest = req.body["interest_id" + req.params.interestId];
        // Merge old interest with new interest, by overwriting old values with new values
        const mergedInterest = Object.assign({}, oldInterest, newInterest);

        // Delete if client update is empty, indicating that the interest should be deleted
        // Else add or update the interest
        if (Object.keys(newInterest).length === 0) {
            delete database.interests["interest_id" + req.params.interestId];
        } else {
            database.interests["interest_id" + req.params.interestId] = mergedInterest;
        }

        // Save database to file
        databaseWriteToFile();

        console.log(newInterest + "\n\r");
        console.log(database.activities);

        const response = { message: "POST: Activity added/altered successfully" }
        res.status(200).json(response); // Send status code 200 back to client
    });

}