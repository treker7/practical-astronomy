#Practical Astronomy - Algorithms Implemented from the Book Practical Astronomy With Your Calculator


##Installation:

npm install --save-dev practical-astronomy


##Usage:

var sun = require('./practical-astronomy/services/sun');
var moon = require('./practical-astronomy/services/moon');
var GeographicCoordinate = require("../models/geographicCoorindate");

const myLocation = new GeographicCoordinate(42.37, -71.05);
const myTime = moment();

var riseAndSetTimes = sun.getRiseAndSetTime(myLocation, myTime);
console.log('The sun will rise at: ' + riseAndSetTimes.riseTime);
console.log('The sun will set at: ' + riseAndSetTimes.setTime);

var moonPhase = moon.getPhase(myTime);
console.log('The current moon phase is: ' + moonPhase);
