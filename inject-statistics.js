var style = document.createElement("link");
style.rel = "stylesheet";
style.type = "text/css";
style.href = chrome.extension.getURL("histogram.css");

document.documentElement.appendChild(style);

var s = document.createElement("script");
s.type = "text/javascript";
s.src = chrome.extension.getURL("statistics.js");

document.documentElement.appendChild(s);

console.log("loaded injector");
