console.log("This is called from popup.js file");

// everything below is for executing code in page js when popup js is called aka when chrome ext is pressed

$(document).ready(function() {
 chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    // we can get tab id with this, so then we can execute page.js for the current tab we are in after clicking the extension
    chrome.tabs.sendMessage(tabs[0].id, {getList: 1}, function (response) {

        });
    });
});