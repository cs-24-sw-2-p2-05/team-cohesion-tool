//****************************************************************
// INFO:
// This file contains the main app logic for the server
//
//
//
//****************************************************************

//****************************************************************
// Import and exports
//****************************************************************

//****************************************************************
// Constants
//****************************************************************

const illigalChars = ["<", ">", "&", "\"", "'", "/", "\\", "(", ")", "{", "}", "[", "]", "=", "+", "-", "*", "%", "#", "@", "!", "?", ":", ";", ",", ".", " "];
const minUsernamePartLength = 4;
const maxUsernamePartLength = 20;
const ValidationError = "Validation Error"; // needs moving to routing part with other errors

//****************************************************************
// Sanitize functions
//****************************************************************

function sanitizeString(str) {
    for (let i = 0; i < illigalChars.length; i++) {
        str = str.replace(illigalChars[i], "");
    }
    
    return str;
}

//****************************************************************
// Valudation functions
//****************************************************************

function validateUsername(userName) {
    let name = sanitizeString(userName);
    if ((name.length >= minUsernamePartLength) && (name.length <= maxUsernamePartLength)) {
        return name;
    }
    throw new Error(ValidationError);
}


//****************************************************************
// Record forms functions
//****************************************************************


//****************************************************************
// Database access functions
//****************************************************************


//****************************************************************
// Conversion functions
//****************************************************************


//****************************************************************
// HTML rendering functions
//****************************************************************

function renderHTMLHomePage(userID) {
    return `<body>
        ${body}
    </body>`
}

function renderHTMLProfilePage(userID) {
    return `<body>
        ${body}
    </body>`
}

function renderHTMLInterestPage(userID) {
    return `<body>
        ${body}
    </body>`
}

function renderHTMLCalendarPage(userID) {
    return `<body>
        ${body}
    </body>`
}

function renderHMTLTeamPage(userID) {
    return `<body>
        ${body}
    </body>`
}


function renderHTMLTeamCalendarPage(userID) {
    return `<body>
        ${body}
    </body>`
}

function renderHTMLResutlsPage(userID) {
    return `<body>
        ${body}
    </body>`
}

function renderHTMLNav(userID) {
    return `<nav>
        <a href="/">Home</a> |
        <a href="/profile?userID=${userName}">${userName}'s Profile</a> |
        <a href="/team?teamID=">Team-Page</a>
    </nav>`

}

function renderHTMLHead(title, csss=[], scripts=[]) {
    let cssString="";
	for(let i=0;i<csss.length;i++){
		let css=csss[i];
		cssString+=`${css===""?"":"<link rel=\"stylesheet\" type=\"text/css\" href=\""+css+"\">\n"}`;
	}
    let scriptString="";
	for(let i=0;i<scripts.length;i++){
		let script=scripts[i];
		scriptString+=   `${script===""?"":"<script defer src=\""+script+"\"></script>\n"}`;
	} 

    let str=`
	<!DOCTYPE html>
	<html lang="da">
	<head>
        <meta charset="utf-8"> 
		<title>${title}</title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1">
		${cssString}
		${scriptString}
	</head>`;
	return str;
}