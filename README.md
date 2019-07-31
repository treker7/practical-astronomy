Practical Astronomy - Algorithms Implemented from Practical Astronomy With Your Calculator

Install:
npm install --save-dev practical-astronomy

Use:
var sun = require('./practical-astronomy/services/sun');
var GeographicCoordinate = require("../models/geographicCoorindate");

const myLocation = new GeographicCoordinate(42.37, -71.05);
const myTime = moment();

var riseAndSetTimes = sun.getRiseAndSetTime(myLocation, myTime);
console.log('The sun will rise at: ' + riseAndSetTimes.riseTime);