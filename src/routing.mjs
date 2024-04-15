// Import database. asserted as a json file
import database from './db.json' with { type:"json"};
// Importing server app
import { app } from './main.mjs';
// Import express routes
export { routes };

// The __dirname  = current/root directory
const __dirname = import.meta.dirname;

// Function to route the server, GET, POST, PUT, DELETE
function routes() {

    // GET routing

    // GET request to the root directory, which is the index.html file
    app.get('/', (req, res) => {
        res.sendFile('./public/html/index.html', { root: __dirname });
    });

    /* GET routing for algorithm */
    app.get('/teams/:team/calculate', (req, res) => {
        console.log(req.params.team);
    });

    /* Database GET routing */

    // Following routing mainly using route parameters to get specific data from the database
    // Routeing parametre like "/something/:parameter"

    // Get data from JSON file, and make a response to client
    function getInduvidualDataFromJSONFileWithResponse(type, id, res) {
        const data = database[type][id]; // Get the specific type of data, together with the key to get specific object in database (like a specific profile)
        if (data) {
            res.json(data);
        } else {
            res.status(404).send(`${type} with id: ${id} not found`);
        }
    }

    // GET request to a specific profiles data
    // The profileId is passed as a parameter in the URL. ":profileId" is said parameter
    app.get('/profiles/:profileId', (req, res) => {
        const profileId = "profile_id" + req.params.profileId; // Get the profileId from the request

        // If the profile exists, else return a 404 status code with error
        getInduvidualDataFromJSONFileWithResponse('profiles', profileId, res);
    });

    // GET request to a specific teams data
    // The teamId is passed as a parameter in the URL. ":teamId" is said parameter
    app.get('/teams/:teamId', (req, res) => {
        const teamId = "team_id" + req.params.teamId; // Get the teamId from the request

        // If the team exists, else return a 404 status code with error
        getInduvidualDataFromJSONFileWithResponse('teams', teamId, res);
    });

    // GET request to a specific activitys data
    // The activityId is passed as a parameter in the URL. ":activityId" is said parameter
    app.get('/activities/:activityId', (req, res) => {
        const activityId = "activity_id" + req.params.activityId; // Get the activityId from the request

        // If the activity exists, else return a 404 status code with error
        getInduvidualDataFromJSONFileWithResponse('activities', activityId, res);
    });

    // GET request to a specific interests data
    // The interestId is passed as a parameter in the URL. ":interestId" is said parameter
    app.get('/interests/:interestId', (req, res) => {
        const interestId = "interest_id" + req.params.interestId; // Get the interestId from the request

        // If the interest exists, else return a 404 status code with error
        getInduvidualDataFromJSONFileWithResponse('interests', interestId, res);
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

    // Get request for all activities related to an interest
    app.get("/activities/interests/:interestId", (req, res) => {
        const interestId = "interest_id" + req.params.interestId;
        const relatedActivities = [] //= database.activities.filter(activity => activity.interest_id === interestId);

        // Check if the interest exists
        if (!database.interests[interestId]) {
            res.status(404).send(`No interest with id: ${interestId} found`);
        }

        // Loop though activities in the databse and match with activities from the selected interest
        for (const activityId in database.activities) {
            const activity = database.activities[activityId]; // Get the specific activity, that we want to check if includes specific interest

            if (activity.interests.includes(interestId)) {
                relatedActivities.push(activity); // Append to selectedActivities, as in, that is the activities that are related to the interest
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
    app.get("/profiles/teams/:teamId", (req, res) => {
        const teamId = "team_id" + req.params.teamId;
        const relatedProfiles = [] //= database.profiles.filter(profile => profile.team_id === teamId);
        
        // check if the team exists
        if (!database.teams[teamId]) {
            res.status(404).send(`No team with id: ${teamId} found`);
        }
        const specificTeam = database.teams[teamId]; // Get the specific team, that we want to find all profiles for
        console.log(specificTeam);

        // Loop though profiles in the databse and match with profiles from the selected team
        for (const profileId in database.profiles) {
            const profile = database.profiles[profileId]; // Get the specific profile, that we want to check if is included in specific team

            if (specificTeam.profile_ids.includes(profileId)) {
                console.log(profile);
                relatedProfiles.push(profile); // Append to selectedProfiles, as in, that is the profiles that are related to the team
            }
        }

        // Send data if exists, else return a 404 status code
        if (relatedProfiles != []) {
            res.json(relatedProfiles);
        } else {
            res.status(404).send(`No profiles related to the specified team: ${teamId} found`);
        }
    });


    /* POST routing */


    // Following should be POST or PUT

    // POST request to add a new profile to the database
    // - Deny if profile already exists

    // POST request to add activity to profile
    // -maybe cull old interested activities then

    // POST request to add available time to profile
    // - maybe cull old times then

    // POST for profile changing team
    // - Remove profile from old team

    // POST request to add a new team to the database, w/ attached profile
    // - Remove profile from old team

    // POST request to add timeframe to team

    // POST to calculate team compatibility based on interests in activities and available time, in the specifiec period

    // POST request to add a new activity to the database, w/ attached interest

    // POST request to add a new interest to the database

}