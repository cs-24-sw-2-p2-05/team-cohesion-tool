// INFO:
// This file contains the central algorithem for the web-app

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
"use strict";

// import and exports with ES6 modules
// exporting functions for testing and for use in program
export { activitySuggester, timerInterval, consecutiveTime, nextInterval, prevInterval, uniqueAndSort };

// main logic for the algorithm
function activitySuggester(team, profiles, activities) {
    let time_intervals = timerInterval(team, profiles);
    let consecutive_times = consecutiveTime(time_intervals, team);
    let list_consecutive_times = uniqueAndSort(consecutive_times);
    let ranked_list = activityRanker(list_consecutive_times, profiles, activities);

    return ranked_list;
}

function timerInterval(team, profiles) {
    let time_intervals = {};

    // Getting and initializing dates
    const startDate = new Date(team.time_frame["from"]);
    const endDate = new Date(team.time_frame["to"]);

    // Iterating through dates and hours to initialize each array in the dictionary
    let date = new Date(startDate);
    while(date <= endDate) {
        for(let hour = 9; hour <= 23; hour++) {
            time_intervals[date.toISOString().substring(0, 10) + "_" + (hour - 1) + "_" + hour] = [];
        }
        let newDate = date.setDate(date.getDate() + 1);
        date = new Date(newDate);
    }

    // Looking through each profile in team
    team.profile_ids.forEach(profile_id => {
        profiles[profile_id].time_availability.forEach(available_interval => {
            // Ensure that the available interval is between our requested range.
            if (available_interval in time_intervals) {
                time_intervals[available_interval].push(profile_id);
            };
        });
    });

    console.log(time_intervals);
    return time_intervals;
}



// consecutiveTime function
function consecutiveTime(time_intervals, team) {    

    let consecutive_times = {};      // Declaring and initialization of new dictionary

    for (let interval in time_intervals){  // Loop through all intervals in previously defined time

        // only look at intervals where there are enough participants available
        if (time_intervals[interval].length >= Math.ceil(team.profile_ids.length / 2)) { 
            
            consecutive_times[interval] = {};   // initialize empty dictionary at key

            consecutive_times[interval].users = time_intervals[interval];   // transfers participants
            consecutive_times[interval].interval_list = [interval]; //transfers time interval

            let next_hour = nextInterval(interval);

            while ((next_hour in time_intervals) 
                    && (consecutive_times[interval].users.every(user => time_intervals[next_hour].includes(user)))){
                
                let current_hour_array = interval.split('_');
                let current_hour_date = current_hour_array[0];

                let next_hour_array = next_hour.split('_');
                let next_hour_date = next_hour_array[0];

                if (current_hour_date != next_hour_date) {
                    break;
                }

                consecutive_times[interval].interval_list.push(next_hour);

                next_hour = nextInterval(next_hour);
            }

            let prev_hour = prevInterval(interval);

            while ((prev_hour in time_intervals)  
                    && (consecutive_times[interval].users.every(user => time_intervals[prev_hour].includes(user)))) {

                let current_hour_array = interval.split('_');
                let current_hour_date = current_hour_array[0];

                let prev_hour_array = prev_hour.split('_');
                let prev_hour_date = prev_hour_array[0];

                if(current_hour_date != prev_hour_date) {
                    break;
                }

                    consecutive_times[interval].interval_list.unshift(prev_hour);
                
                prev_hour = prevInterval(prev_hour);

            }
        } 
    }

    return consecutive_times;
}

// helper function that changes yyyy-mm-dd_h2_h3 to yyyy-mm-dd_h3_h4
function nextInterval(dateString) {
    let dateArray = dateString.split('_');;
    let date = new Date(dateArray[0]);
    let startHour = parseInt(dateArray[1]);
    let endHour = parseInt(dateArray[2]);

    let newStartHour = (startHour + 1);
    let newEndHour = (endHour + 1);

    if (newEndHour > 23) {
        
        date.setDate(date.getDate() + 1);

        newStartHour = 8;
        newEndHour = 9;
    }

    let newDateString = date.toISOString().substring(0, 10) + '_' + newStartHour + '_' + newEndHour;

    return newDateString;

}

// helper function that changes yyyy-mm-dd_h2_h3 to yyyy-mm-dd_h1_h2
function prevInterval(dateString) {
    let dateArray = dateString.split("_");
    let date = new Date(dateArray[0]);
    let startHour = parseInt(dateArray[1]);
    let endHour = parseInt(dateArray[2]);

    let newStartHour = (startHour - 1);
    let newEndHour = (endHour - 1);

    if (newStartHour < 8) { 
        date.setDate(date.getDate() - 1);
        
        newStartHour = 22;
        newEndHour = 23;
    }

    let newDateString = date.toISOString().substring(0, 10) + '_' + newStartHour + '_' + newEndHour;
    //console.log(newDateString);

    return newDateString;
}

function arrayEquals(a, b) {
    return a.every(item => b.includes(item)) && b.every(item => a.includes(item));
}

function uniqueAndSort(consecutive_times) {
    let list_consecutive_times = [];

    // Create unique list from non-unique elements.
    for (const interval of Object.values(consecutive_times)){
        const elem_already_exists = list_consecutive_times.some(elem => {
            return arrayEquals(interval.users, elem.users) && arrayEquals(interval.interval_list, elem.interval_list)
        });
        if (!elem_already_exists) {
            list_consecutive_times.push(interval);
        }
    }

    // Sort list by participation amount, then by interval size.
    list_consecutive_times.sort((a, b) => {
        const user_size = b.users.length - a.users.length;
        const interval_size = b.interval_list.length - a.interval_list.length;
        return (user_size == 0) ? interval_size : user_size;
    });

    return list_consecutive_times;
}

// activityRanker function
function activityRanker(list_consecutive_times, profiles, activities) {  
    let lengthOfList = list_consecutive_times.length; 
   
    // scoring activities
    for (let i = 0; i < lengthOfList; i++) {
        let scored_activities = {}

        // add 1 score for activity match
        list_consecutive_times[i].users.forEach(profile => {
            let user = profile;

            for(const key in activities) {
                let activity_key = key;

                if (activities[activity_key].time_interval <= list_consecutive_times[i].interval_list.length) {

                    if(profiles[user].activity_ids.includes(activity_key)) {

                        if(Object.keys(scored_activities).includes(activity_key) == false) {
                            scored_activities[activity_key] = 1;
                        } else {
                        scored_activities[activity_key] += 1;
                        }
                       
                    }

                }
            
            }
        })

        list_consecutive_times[i].scored_activities = scored_activities;

        // add 0.5 score for interest match
        list_consecutive_times[i].users.forEach(profile => {
            let user = profile;

            for(const key in scored_activities) {
                let activity_key = key;
                
                let limit = 0;
                while (limit == 0) {
                    if(profiles[user].activity_ids.includes(activity_key) == false) {   
                        activities[activity_key].all_interest_ids.forEach (interest => {

                            for(let i = 0; i < profiles[user].activity_ids.length; i++) {
                                let personal_activity = profiles[user].activity_ids[i];

                                if(activities[personal_activity].all_interest_ids.includes(interest) == true) {
                                    scored_activities[activity_key] += 0.5;
                                    break;   
                                }
                            }
                        });

                     limit += 1;
                    }
                 limit += 1;
                }
            }
        });

        list_consecutive_times[i].scored_activities = scored_activities;
        
    }

    // convert dictionary and sort activities in each consecutive times
    for (let i = 0; i < lengthOfList; i++) {
        let convertDirtoArr = Object.entries(list_consecutive_times[i].scored_activities).map(([key, value]) => ({ [key]: value }));
        
            let sortedArray = convertDirtoArr.sort((a, b) => {
            const valueA = Object.values(a)[0];
            const valueB = Object.values(b)[0];
            
            return valueB - valueA;
        });

        list_consecutive_times[i].scored_activities = sortedArray;

    }    

    console.log("Activity Ranker:",JSON.stringify(list_consecutive_times, null, 2));
    return list_consecutive_times;
}
