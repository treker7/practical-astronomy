/*
 * MoonService Tests
 */

var moment = require("./../node_modules/moment");

var expectToBeWithin = require('./jasmine-helper');

var moon = require("../services/moonService");
var CoordinateSystemService = require("../services/coordinateSystemService");
var GeographicCoordinate = require("../models/geographicCoorindate");
var EquatorialCoordinate = require("../models/equatorialCoordinate");
var HorizonCoordinate = require("../models/horizonCoordinate");

describe("MoonService", function () {

    beforeEach(function () {

    });

    // From Practical Astronomy With Your Calculator 4th edition section 65.
    it("Calculates the moon's position correctly in the example from the PAWYC book", function () {
        const localDate = moment().utcOffset(0).year(2003).month(8).date(1).hour(0).minute(0).second(0).millisecond(0);
        const expectedEquatorialCoordinate = new EquatorialCoordinate(toDecimalDegreesFromHourMinSec(14, 12, 42), -1 * toDecimalDegreesFromDegMinSec(11, 31, 38));

        var actualEquatorialCoordinate = moon.getEquatorialCoordinate(localDate);
        expectToBeWithin(actualEquatorialCoordinate.rightAscension, expectedEquatorialCoordinate.rightAscension, .01);
        expectToBeWithin(actualEquatorialCoordinate.declination, expectedEquatorialCoordinate.declination, .01);
    });

    // From http://aa.usno.navy.mil/data/docs/AltAz.php
    it("Calculates the moon's position correctly (example from us navy site)", function () {
        const localDate = moment().utcOffset(-4).year(2018).month(3).date(10).hour(8).minute(0).second(0).millisecond(0);
        const geographicCoordinate = new GeographicCoordinate(42, -80);
        const expectedHorizonCoordinate = new HorizonCoordinate(159.9, 28.2);

        var moonEquatorialCoordinate = moon.getEquatorialCoordinate(localDate);
        var actualHorizonCoordinate = CoordinateSystemService.convertFromEquatorialToHorizonCoordinate(moonEquatorialCoordinate, geographicCoordinate, localDate);

        expectToBeWithin(actualHorizonCoordinate.altitude, expectedHorizonCoordinate.altitude, 1);
        expectToBeWithin(actualHorizonCoordinate.azimuth, expectedHorizonCoordinate.azimuth, 1);
    });

    // From Practical Astronomy With Your Calculator 4th edition section 67.
    it("Calculates the moon's phase correctly in the example from the PAWYC book", function () {
        const localDate = moment().utcOffset(0).year(2003).month(8).date(1).hour(0).minute(0).second(0).millisecond(0);
        const expectedPhase = .225;

        var actualPhase = moon.getPhase(localDate);
        expectToBeWithin(actualPhase, expectedPhase, 3);
    });

    // From http://aa.usno.navy.mil/data/docs/AltAz.php
    it("Calculates the moon's phase correctly (example from us navy site)", function () {
        const localDate = moment().utcOffset(-4).year(2018).month(3).date(11).hour(12).minute(0).second(0).millisecond(0);
        const expectedPhase = .200;

        var actualPhase = moon.getPhase(localDate);
        expectToBeWithin(actualPhase, expectedPhase, .01);
    });

    // angle conversion functions
    var toDecimalDegreesFromDegMinSec = function (degs, arcMins, arcSecs) {
        return (degs + (arcMins / 60.0) + (arcSecs / 3600.0));
    }
    var toDecimalDegreesFromHourMinSec = function (hours, mins, secs) {
        return (15 * (hours + (mins / 60.0) + (secs / 3600.0)));
    }
});