// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
'use strict'


//****************************************************************
// HTML elements show/hide function
//****************************************************************

/* function showElementByID(elementID) {
    let element = document.getElementById(elementID);
    element.style.visibility = "visible";
}

function hideElementByID(elementID) {
    let element = document.getElementById(elementID);
    element.style.visibility = "hidden";
} */

function disableElementByID(elementID) {
    let element = document.getElementById(elementID);
    if (element) {
        //console.log("disableElementByID: " + elementID);
        element.style.display = "none";
    } else {
        console.error("disableElementByID: Element not found with ID: " + elementID);
    }
}

function enableElementByID(elementID) {
    let element = document.getElementById(elementID);
    if (element) {
        //console.log("enableElementByID: " + elementID);
        element.style.display = "block";
    } else {
        console.error("enableElementByID: Element not found with ID: " + elementID);
    }
}

//****************************************************************
// HTML Events
//****************************************************************

// navMenu buttons mapping to selection
// returns a string with selection id name, from the navMenu button id
function navMenuBtnToSelection(navBtnID) {
    let selectionID = navBtnID.replace("btn", "section");
    //console.log("navMenuBtnToSelection: " + selectionID);
    return selectionID;
}

// Hide all selections
function hideAllSelections() {
    let menuBtns = document.querySelectorAll("nav button"); // Get all nav buttons
    menuBtns.forEach(element => {
        let navBtnID = element.id;
        disableElementByID(navMenuBtnToSelection(navBtnID));
        //console.log("hideAllSelections: " + navMenuBtnToSelection(navBtnID)); 
    });
}

// Show selection
function showSelection(navBtnID) {
    hideAllSelections();
    enableElementByID(navMenuBtnToSelection(navBtnID));
}

function navButtonHandler(event) {
    let navBtnID = event.target.id;
    showSelection(navBtnID);
}

function addNavButtonEventlisteners() {
    let menuBtns = document.querySelectorAll("nav button"); // Get all nav buttons
    menuBtns.forEach(element => {
        element.addEventListener("click", navButtonHandler);
    });
}

// If DOM is fully loaded, add eventlisteners to nav buttons
document.addEventListener("DOMContentLoaded", addNavButtonEventlisteners);
