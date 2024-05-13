
export { consecutiveTime };

function consecutiveTime(time_intervals, team){    

    let consecutive_times = {};      // Declaring and initialization of new dictionary

    for (let interval in time_intervals){  // Loop through all intervals in previously defined time

        /* if (team.profiles == undefined) {
            console.log(time_intervals[interval].length, team.profile_ids.length);
        } */

        // only look at intervals where there are enough participants available
        if (time_intervals[interval].length >= Math.ceil(team.profile_ids.length / 2)) { 
            
            consecutive_times[interval] = {};   // initialize empty dictionary at key

            consecutive_times[interval].users = time_intervals[interval];   // transfers participants
            consecutive_times[interval].interval_list = [interval]; //transfers time interval

            let next_hour = nextInterval(interval);

            while ((next_hour in time_intervals) && (time_intervals[next_hour].length > 0) && (time_intervals[next_hour].every(user => consecutive_times[interval].users.includes(user)))){
                
                let current_hour_array = interval.split('_');
                let current_hour_date = current_hour_array[0];

                let next_hour_array = next_hour.split('_');
                let next_hour_date = next_hour_array[0];

                if (current_hour_date != next_hour_date){
                    break;
                }

                    consecutive_times[interval].interval_list.push(next_hour);

                next_hour = nextInterval(next_hour);
            }

            let prev_hour = prevInterval(interval);

            while ((prev_hour in time_intervals) && (time_intervals[prev_hour].length > 0) && (time_intervals[prev_hour].every(user => consecutive_times[interval].users.includes(user)))){

                let current_hour_array = interval.split('_');
                let current_hour_date = current_hour_array[0];

                let prev_hour_array = prev_hour.split('_');
                let prev_hour_date = prev_hour_array[0];

                if(current_hour_date != prev_hour_date){
                    break;
                }

                    consecutive_times[interval].interval_list.unshift(prev_hour);
                
                prev_hour = prevInterval(prev_hour);

            }
        } 
    }

    console.log(consecutive_times);

    return consecutive_times;
}



// function that changes dd/mm/yyyy_h2_h3 to dd/mm/yyyy_h3_h4
function nextInterval(dateString){
    let dateArray = dateString.split('_');
    //TODO: make to ISO standard, in the future
    //but now, we just reaarange
    let [day, month, year] = dateArray[0].split("/");
    let formattedDate = `${year}-${month}-${day}`;
    let date = new Date(formattedDate);
    let startHour = parseInt(dateArray[1]);
    let endHour = parseInt(dateArray[2]);

    let newStartHour = (startHour + 1);
    let newEndHour = (endHour + 1);

    if (newEndHour > 23){
        
        date.setDate(date.getDate() + 1);

        newStartHour = 8;
        newEndHour = 9;
    }

    let newDateString = date.toLocaleDateString('en-GB') + '_' + newStartHour + '_' + newEndHour;

    return newDateString;

}

// function that changes dd/mm/yyyy_h2_h3 to dd/mm/yyyy_h1_h2
function prevInterval(dateString){
    let dateArray = dateString.split("_");
    //TODO: make to ISO standard, in the future
    //but now, we just reaarange
    let [day, month, year] = dateArray[0].split("/");
    let formattedDate = `${year}-${month}-${day}`;
    let date = new Date(formattedDate);

    console.log(dateArray[0]);
    console.log(date);
    let startHour = parseInt(dateArray[1]);
    let endHour = parseInt(dateArray[2]);

    let newStartHour = (startHour - 1);
    let newEndHour =(endHour - 1);

    if (newStartHour < 8){

        date.setDate(date.getDate() - 1);
        

        newStartHour = 22;
        newEndHour = 23;
    }

    let newDateString = date.toLocaleDateString('en-GB') + '_' + newStartHour + '_' + newEndHour;
    console.log(newDateString);

    return newDateString;
}