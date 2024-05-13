

function consecutiveTime(time_intervals, team){    

    let consecutive_times = {};      // Declaring and initialization of new dictionary

    for (let key in time_intervals){  // Loop through all intervals in previously defined time

        // only look at intervals where there are enough participants available
        if (length(time_intervals[interval]) >= Math.ceil(length(team.profiles) / 2)) { 
            
            consecutive_times[interval] = {};

            consecutive_times[interval].users = time_intervals[interval]; // transfers participants
            consecutive_times[interval].interval_list = [interval]; //transfers time interval

            let next_hour = nextInterval(interval);

            while (next_hour in time_intervals){
                
            }

            let prev_hour = prevInterval(interval);

            while (time_intervals.includes(prev_hour)){

            }
        }


    };
}

// function that changes dd/mm/yyyy_h1-h2 to dd/mm/yyyy_h2-h3
function nextInterval(dateString){
    let dateArray = dateString.split("_");
    let date = new Date(dateArray[0]);
    let hourRange = dateArray[1].split('-');
    let startHour = parseInt(hourRange[0]);
    let endHour = parseInt(hourRange[1]);

    let newStartHour = (startHour + 1);
    let newEndHour = (endHour + 1);

    if (newEndHour > 23){
        
        date.setDate(date.getDate() +1)

        newStartHour = 8
        

    }

}

function prevInterval(dateString){

}