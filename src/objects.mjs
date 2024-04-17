// Import export with ES6 modules
export { Profile, Team, Activity, Interest };

// Profile object constructor
function Profile(name, activity_ids, time_availability) {
    this.name = name;
    this.activity_ids = activity_ids;
    this.time_availability = time_availability;
}

// Team object constructor
function Team(name, profile_ids, time_frame) {
    this.name = name;
    this.profile_ids = profile_ids;
    this.time_frame = time_frame;
}

// Activity object constructor
function Activity(name, description, main_interest_id, all_interest_ids, time_interval) {
    this.name = name;
    this.description = description;
    this.main_interest_id = main_interest_id;
    this.all_interest_ids = all_interest_ids;
    this.time_interval = time_interval;
}

// Interest object constructor
function Interest(name) {
    this.name = name;
}
