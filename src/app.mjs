// INFO:
// This file contains the main app logic for the server

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
"use strict";

// import and exports with ES6 modules

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

export { ActivityRanker }

//Activity Ranker
function ActivityRanker(list_consecutive_times, profiles, activities){  
    let lengthOfList = list_consecutive_times.length; 
    //console.log(list_consecutive_times);
    //console.log("length:"+lengthOfList); 
   
    for (let i = 0; i < lengthOfList; i++){
        let scored_activities = {}

//finding 1

        list_consecutive_times[i].users.forEach(profile => {
           // console.log(profile);
            let user = profile;

            for(const key in activities){
                let activity_key = key;

                if (activities[activity_key].time_interval <= list_consecutive_times[i].interval_list.length){
  //                  console.log(list_consecutive_times[i] + activity_key);

                    if(profiles[user].activity_ids.includes(activity_key)){
                       // console.log(activity_key);

                        if(Object.keys(scored_activities).includes(activity_key) == false){
                            scored_activities[activity_key] = 1;
                        }
                        else {
                        scored_activities[activity_key] += 1;
                        }
                       
                    }

            }
            
    }})


    list_consecutive_times[i].scored_activities = scored_activities;
   // console.log(list_consecutive_times[i]);

   // console.log("including 0.5");

// finding 0.5

    list_consecutive_times[i].users.forEach(profile => {
        // console.log(profile);
         let user = profile;

        //console.log("hej")

         for(const key in scored_activities){
            //console.log("hej")
            let activity_key = key;
//for of
            let limit = 0;
            while (limit == 0) {
               // console.log("hej")
            if(profiles[user].activity_ids.includes(activity_key) == false){   
                activities[activity_key].all_interest_ids.forEach (interest => {
                   // console.log(user);
                   // console.log(activity_key);


                    for(let i = 0; i < profiles[user].activity_ids.length; i++){
                    //console.log(profiles[user].activity_ids[i]);
                    let personal_activity = profiles[user].activity_ids[i];
                    if(activities[personal_activity].all_interest_ids.includes(interest) == true){
                       // console.log("personal");
                       // console.log(user);
                      //  console.log(personal_activity);
                        scored_activities[activity_key] += 0.5;
                        break;   
                    }
                    }
                } 
            )
            limit += 1;
            }
            limit += 1;
        }}})

        list_consecutive_times[i].scored_activities = scored_activities;
        console.log(list_consecutive_times[i]);

        }

        //Sorting each "scored activities"

         for (let i = 0; i < lengthOfList; i++){
           let convertDirtoArr = Object.entries(list_consecutive_times[i].scored_activities).map(([key, value]) => ({ [key]: value }));

           console.log("unsorted", convertDirtoArr);

           let sortedArray = convertDirtoArr.sort((a, b) => {
            const valueA = Object.values(a)[0];
            const valueB = Object.values(b)[0];

            return valueB - valueA;
           });


          list_consecutive_times[i].scored_activities = sortedArray;
           
       console.log("sorted", sortedArray);

        }    

//        console.log(JSON.stringify(list_consecutive_times, null, 2));
}