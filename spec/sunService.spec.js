/*
 * SunService Tests
 */

var moment = require("../node_modules/moment");

var expectToBeWithin = require('./jasmine-helper');

var sun = require("../services/sunService");
var EquatorialCoordinate = require("../models/equatorialCoordinate");
var GeographicCoordinate = require("../models/geographicCoorindate");
var RiseAndSetTime = require("../models/riseAndSetTime");

describe("SunService", function () {

    beforeEach(function () {

    });

    // From Practical Astronomy With Your Calculator 4th edition section 46.
    it("Calculates the sun's position correctly", function () {
        const localDate = moment().utcOffset(0).year(2003).month(6).date(27).hour(0).minute(0).second(0).millisecond(0);
        const expectedPosition = new EquatorialCoordinate(toDecimalDegreesFromHourMinSec(8, 23, 34), toDecimalDegreesFromDegMinSec(19, 21, 10));

        var actualPosition = sun.getEquatorialCoordinate(localDate);
        expectToBeWithin(actualPosition.rightAscension, expectedPosition.rightAscension, .01);
        expectToBeWithin(actualPosition.declination, expectedPosition.declination, .01);
    });

    // From Practical Astronomy With Your Calculator 4th edition section 49
    it("Calculates sun rise and set times correctly in the example from the PAWYC book", function () {
        const localDate = moment().utcOffset(-5).year(1986).month(2).date(10).hour(0).minute(0).second(0).millisecond(0);
        const geographicCoordinate = new GeographicCoordinate(42.37, -71.05);

        const expectedRiseAndSetTime = new RiseAndSetTime(toDecimalHours(6, 6), toDecimalHours(17, 43));

        var actualRiseAndSetTimes = sun.getRiseAndSetTime(geographicCoordinate, localDate);
        expectToBeWithin(actualRiseAndSetTimes.riseTime, expectedRiseAndSetTime.riseTime, .1);
        expectToBeWithin(actualRiseAndSetTimes.setTime, expectedRiseAndSetTime.setTime, .1);
    });

    // From http://aa.usno.navy.mil/data/docs/AltAz.php
    it("Calculates the sunrise and set times correctly (example from us navy site)", function () {
        const localDate = moment().utcOffset(-4).year(2018).month(3).date(9);
        const geographicCoordinate = new GeographicCoordinate(42, -80);

        const expectedRiseAndSetTime = new RiseAndSetTime(toDecimalHours(6, 49), toDecimalHours(19, 55));
               
        var actualRiseAndSetTimes = sun.getRiseAndSetTime(geographicCoordinate, localDate);
        expectToBeWithin(actualRiseAndSetTimes.riseTime, expectedRiseAndSetTime.riseTime, .1);
        expectToBeWithin(actualRiseAndSetTimes.setTime, expectedRiseAndSetTime.setTime, .1);
    });

    it("Calculates sun rise and set times correctly for 04/07/2018 in GCC", function () {
        const localDate = moment().utcOffset(-4).year(2018).month(3).date(7);
        const gccGeographicCoordinate = new GeographicCoordinate(41.154, -80.079);

        const expectedRiseAndSetTime = new RiseAndSetTime(toDecimalHours(6, 52), toDecimalHours(19, 52));

        var actualRiseAndSetTimes = sun.getRiseAndSetTime(gccGeographicCoordinate, localDate);
        expectToBeWithin(actualRiseAndSetTimes.riseTime, expectedRiseAndSetTime.riseTime, .1);
        expectToBeWithin(actualRiseAndSetTimes.setTime, expectedRiseAndSetTime.setTime, .1);
    });

    // From Practical Astronomy With Your Calculator 4th edition section 50
    it("Calculates the duration of twilight correctly in the example from PAWYC book", function () {
        const localDate = moment().utcOffset(0).year(1979).month(8).date(7).hour(0).minute(0).second(0).millisecond(0);
        const geographicCoordinate = new GeographicCoordinate(52, 0);

        const expectedTwilightDuration = 2.133411;

        var actualTwilightDuration = sun.getTwilightTime(geographicCoordinate, localDate, 108);
        expectToBeWithin(actualTwilightDuration, expectedTwilightDuration, .0001);
    });

    // angle conversion functions
    var toDecimalDegreesFromDegMinSec = function (degs, arcMins, arcSecs) {
        return (degs + (arcMins / 60.0) + (arcSecs / 3600.0));
    }
    var toDecimalDegreesFromHourMinSec = function (hours, mins, secs) {
        return (15 * (hours + (mins / 60.0) + (secs / 3600.0)));
    }

    // time conversion functions
    var toDecimalHours = function (hours, mins) {
        return (hours + (mins / 60.0));
    }
});