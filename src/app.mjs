// INFO:
// This file contains the main app logic for the server

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
"use strict";

// Import and exports with ES6 modules
//import { fetchCalculatedData } from "./comms.mjs";
//import { fetchProfile, fetchTeam, fetchActivity, fetchInterest, fetchAllInterests, fetchAllTeams, fetchAllActivitiesFromInterest, fetchAllProfilesFromTeam } from "./comms.mjs";
//import { postProfile, postTeam, postActivity, postInterest  } from "./comms.mjs";

//export {validateUsername};

// Constants

const ValidationError = "Validation Error"; // needs moving to routing part with other errors

const illigalChars = ["<", ">", "&", "\"", "'", "/", "\\", "(", ")", "{", "}", "[", "]", "=", "+", "*", "%", "#", "@", "!", "?", ":", ";", ",", ".", "_","-"];
const minUsernamePartLength = 4;
const maxUsernamePartLength = 20;

// Sanitize functions

function sanitizeString(str) {
    for (let i = 0; i < illigalChars.length; i++) {
        str = str.replace(illigalChars[i], "");
    }
    return str;
}

// Validation functions

function validateUsername(userName) {
    let name = sanitizeString(userName);
    if ((name.length >= minUsernamePartLength) && (name.length <= maxUsernamePartLength)) {
        return name;
    }
    throw new Error(ValidationError);
}

// Database access functions 


// Record forms functions


// Conversion functions
//activitySuggester
function ActivitySuggester() {
    let time_intervals = TimerInterval(team, profiles);
    let consecutive_times = ConsecutiveTime(time_intervals, team);
    let list_consecutive_times = UniqueAndSort(consecutive_times);
    let ranked_list = ActivityRanker(list_consecutive_times, profiles, activities);

    return ranked_list;
}


//import { fetchProfile, fetchTeam, fetchActivity, fetchInterest, fetchAllInterests, fetchAllTeams, fetchAllActivitiesFromInterest, fetchAllProfilesFromTeam } from "./comms.mjs";

export {TimerInterval};


// TimerInterval function
function TimerInterval(team, profiles) {
    //fetching all necessary information information
    let teamInfoObj = team;//fetchTeam(team_id);

    let time_intervals = {};

    //getting and initializing dates
    let startDate = new Date(teamInfoObj.time_frame["from"]);
    let endDate = new Date(teamInfoObj.time_frame["to"]);

 //   console.log(startDate);
 //   console.log(endDate);

    let date = new Date(startDate);
    
    //iterating through dates and hours to initialize each element in the dictionary
    //dd/mm/yyyy_h1_h2
    while(date <= endDate){
        for(let hour = 9; hour <= 23; hour++){
            let hour_interval = hour-1 + "_" + hour;

 //           console.log(date + hour_interval);

            time_intervals[date.toLocaleDateString("en-GB") + "_" + hour_interval] = [];
        }
        let newDate = date.setDate(date.getDate() + 1);
        date = new Date(newDate);
    }
    console.log(time_intervals);

    //looking through each profile in team
    teamInfoObj.profile_ids.forEach(profile => {

        console.log(profile);

        let profileObj = profiles[profile];//fetchProfile(profile);

        console.log(profileObj);

        profileObj.time_availability.forEach(available_interval => {
            
            console.log(available_interval);

            time_intervals[available_interval].push(profile);
        })
     })

     console.log(time_intervals);

    return time_intervals;
}

/*
  //accessing each profile in profiles of the team
  teamInfoObj.profile_ids.forEach(functionProfiles(profiles_ids));

  //then doing that function
    function functionProfiles(profile){
    let profileObj = fetchProfile(profile);
    profileObj.time_availability.forEach(available_interval => {
        time_intervals[available_interval].append(profile);
    })
    }
*/

 
 