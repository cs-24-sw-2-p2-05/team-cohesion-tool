// INFO:
// This file contains the main app logic for the server

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
"use strict";

// Import and exports with ES6 modules

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

// Valudation functions

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



function ActivitySuggester() {
    let time_intervals = TimerInterval(team, profiles);
    let consecutive_times = ConsecutiveTime(time_intervals, team);
    let list_consecutive_times = UniqueAndSort(consecutive_times);
    let ranked_list = ActivityRanker(list_consecutive_times, profiles, activities);

    return ranked_list;
}