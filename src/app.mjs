// INFO:
// This file contains the main app logic for the server

/* Import and exports */

//export {validateUsername, renderHMTLTeamPage, renderHTMLCalendarPage, renderHTMLHomePage, renderHTMLInterestPage, renderHTMLNav, renderHTMLProfilePage, renderHTMLResutlsPage, renderHTMLTeamCalendarPage, renderHTMLHead};

/* Constants */


const ValidationError = "Validation Error"; // needs moving to routing part with other errors

const illigalChars = ["<", ">", "&", "\"", "'", "/", "\\", "(", ")", "{", "}", "[", "]", "=", "+", "*", "%", "#", "@", "!", "?", ":", ";", ",", ".", "_","-"];
const minUsernamePartLength = 4;
const maxUsernamePartLength = 20;

/* Sanitize functions */

function sanitizeString(str) {
    for (let i = 0; i < illigalChars.length; i++) {
        str = str.replace(illigalChars[i], "");
    }
    return str;
}

/* Valudation functions */

function validateUsername(userName) {
    let name = sanitizeString(userName);
    if ((name.length >= minUsernamePartLength) && (name.length <= maxUsernamePartLength)) {
        return name;
    }
    throw new Error(ValidationError);
}


/* Record forms functions */


/* Database access functions */


/* let testDBFile = fs.readFileSync("testDB.json");
let testDB = JSON.parse(testDBFile); */


/* Conversion functions */

