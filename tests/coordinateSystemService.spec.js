/*
 * CoordinateSystemService Tests
 * 
 * All testing data is taken from Stellarium 0.16.0
 * All dates are 12:00 a.m. on Januray 1st, 2015
 * All locaions are Lat: 41.8125, Long: -80.0935
 */

var moment = require("./../node_modules/moment/moment");

var CoordinateSystemService = require("../services/coordinateSystemService");
var AstronomicalObject = require("../models/astronomicalObject");
var HorizonCoordinate = require("../models/horizonCoordinate");
var EquatorialCoordinate = require("../models/equatorialCoordinate");
var EclipticCoordinate = require("../models/eclipticCoordinate");
var EquatorialCoordinate = require("../models/equatorialCoordinate");
var GeographicCoordinate = require("../models/geographicCoorindate");
var RiseAndSetTime = require("../models/riseAndSetTime");
var DEFAULT_LOCATION = require("../config/defaultLocation");

describe("CoordinateSystemService", function () {
    const midnightJanuary2015 = moment(new Date(2015, 0, 1, 0, 0, 0, 0));
    const precision = 4; // 1 / 10,000 (less than one arc second)

    beforeEach(function () {

    });

    it("Converts Rigel's equatorial coordinates to horizon coordinates.", function () {
        var astronomicalObject = new AstronomicalObject(toDecimalDegreesFromHourMinSec(5, 14, 32.28), -1 * toDecimalDegreesFromDegMinSec(8, 12, 5.9), "Rigel");

        var actualHorizonCoordinate = CoordinateSystemService.convertFromEquatorialToHorizonCoordinate(astronomicalObject, DEFAULT_LOCATION, midnightJanuary2015); 
        
        const expectedHorizonCoordinate = new HorizonCoordinate(toDecimalDegreesFromDegMinSec(200, 59, 14.8), toDecimalDegreesFromDegMinSec(37, 45, 0.4));
        expect(actualHorizonCoordinate.azimuth).toBeCloseTo(expectedHorizonCoordinate.azimuth, precision);
        expect(actualHorizonCoordinate.altitude).toBeCloseTo(expectedHorizonCoordinate.altitude, precision);
    });

    it("Converts Denebola's equatorial coordinates to horizon coordinates.", function () {
        var astronomicalObject = new AstronomicalObject(toDecimalDegreesFromHourMinSec(11, 49, 3.07), toDecimalDegreesFromDegMinSec(14, 34, 17.6), "Denebola");

        var actualHorizonCoordinate = CoordinateSystemService.convertFromEquatorialToHorizonCoordinate(astronomicalObject, DEFAULT_LOCATION, midnightJanuary2015);

        const expectedHorizonCoordinate = new HorizonCoordinate(toDecimalDegreesFromDegMinSec(84, 14, 16.8), toDecimalDegreesFromDegMinSec(15, 33, 1.7));
        expect(actualHorizonCoordinate.azimuth).toBeCloseTo(expectedHorizonCoordinate.azimuth, precision);
        expect(actualHorizonCoordinate.altitude).toBeCloseTo(expectedHorizonCoordinate.altitude, precision);
    });

    it("Converts Vega's equatorial coordinates to horizon coordinates.", function () {
        var astronomicalObject = new AstronomicalObject(toDecimalDegreesFromHourMinSec(18, 36, 56.46), toDecimalDegreesFromDegMinSec(38, 47, 6.4), "Vega");

        var actualHorizonCoordinate = CoordinateSystemService.convertFromEquatorialToHorizonCoordinate(astronomicalObject, DEFAULT_LOCATION, midnightJanuary2015);

        const expectedHorizonCoordinate = new HorizonCoordinate(toDecimalDegreesFromDegMinSec(356, 54, 27.9), -1 * toDecimalDegreesFromDegMinSec(9, 18, 27.3));
        expect(actualHorizonCoordinate.azimuth).toBeCloseTo(expectedHorizonCoordinate.azimuth, precision);
        expect(actualHorizonCoordinate.altitude).toBeCloseTo(expectedHorizonCoordinate.altitude, precision);
    });

    it("Converts Mahasim's equatorial coordinates to horizon coordinates.", function () {
        var astronomicalObject = new AstronomicalObject(toDecimalDegreesFromHourMinSec(5, 59, 43.3), toDecimalDegreesFromDegMinSec(37, 12, 44.6), "Mahasim");

        var actualHorizonCoordinate = CoordinateSystemService.convertFromEquatorialToHorizonCoordinate(astronomicalObject, DEFAULT_LOCATION, midnightJanuary2015);

        const expectedHorizonCoordinate = new HorizonCoordinate(toDecimalDegreesFromDegMinSec(223, 6, 5.6), toDecimalDegreesFromDegMinSec(83, 52, 5.8));
        expect(actualHorizonCoordinate.azimuth).toBeCloseTo(expectedHorizonCoordinate.azimuth, precision);
        expect(actualHorizonCoordinate.altitude).toBeCloseTo(expectedHorizonCoordinate.altitude, precision);
    });

    it("Converts Antares's equatorial coordinates to horizon coordinates.", function () {
        var astronomicalObject = new AstronomicalObject(toDecimalDegreesFromHourMinSec(16, 29, 24.46), -1 * toDecimalDegreesFromDegMinSec(26, 25, 55.6), "Antares");

        var actualHorizonCoordinate = CoordinateSystemService.convertFromEquatorialToHorizonCoordinate(astronomicalObject, DEFAULT_LOCATION, midnightJanuary2015);

        const expectedHorizonCoordinate = new HorizonCoordinate(toDecimalDegreesFromDegMinSec(64, 57, 0.7), -1 * toDecimalDegreesFromDegMinSec(62, 29, 41.5));
        expect(actualHorizonCoordinate.azimuth).toBeCloseTo(expectedHorizonCoordinate.azimuth, precision);
        expect(actualHorizonCoordinate.altitude).toBeCloseTo(expectedHorizonCoordinate.altitude, precision);
    });

    it("Converts Navi's equatorial coordinates to horizon coordinates.", function () {
        var astronomicalObject = new AstronomicalObject(toDecimalDegreesFromHourMinSec(0, 56, 42.57), toDecimalDegreesFromDegMinSec(60, 43, 0.6), "Navi");

        var actualHorizonCoordinate = CoordinateSystemService.convertFromEquatorialToHorizonCoordinate(astronomicalObject, DEFAULT_LOCATION, midnightJanuary2015);

        const expectedHorizonCoordinate = new HorizonCoordinate(toDecimalDegreesFromDegMinSec(321, 13, 19.8), toDecimalDegreesFromDegMinSec(39, 42, 34.1));
        expect(actualHorizonCoordinate.azimuth).toBeCloseTo(expectedHorizonCoordinate.azimuth, precision);
        expect(actualHorizonCoordinate.altitude).toBeCloseTo(expectedHorizonCoordinate.altitude, precision);
    });

    // From Practical Astronomy With Your Calculator 4th edition section 27.
    it("Converts from ecliptic to equatorial coordinates", function () {
        const eclipticCoordinate = new EclipticCoordinate(4.875278, 139.68611);
        const localDate = moment().year(2009).month(6).date(6).hour(0).minute(0).second(0).millisecond(0);

        const expectedEquatorialCoordinate = new EquatorialCoordinate(143.722173, 19.535003);
        var actualEquatorialCoordinate = CoordinateSystemService.convertFromEclipticToEquatorialCoordinate(eclipticCoordinate, localDate);

        expect(actualEquatorialCoordinate.rightAscension).toBeCloseTo(expectedEquatorialCoordinate.rightAscension, 4);
        expect(actualEquatorialCoordinate.declination).toBeCloseTo(expectedEquatorialCoordinate.declination, 4);
    });

    // From Practical Astronomy With Your Calculator 4th edition section 27.
    it("Calculates ecliptic obliquity correctly", function () {
        const localDate = moment().year(2009).month(6).date(6).hour(0).minute(0).second(0).millisecond(0);

        const expectedEclipticObliquity = 23.43805531;
        var actualEclipticObliquity = CoordinateSystemService.getEclipticObliquity(localDate);

        expect(actualEclipticObliquity).toBeCloseTo(expectedEclipticObliquity, 4);
    });

    // From Practical Astronomy With Your Calculator 4th edition section 33.
    it("Calculates rising and setting times correctly", function () {
        const starEquatorialCoordinates = new EquatorialCoordinate(toDecimalDegreesFromHourMinSec(23, 39, 20), toDecimalDegreesFromDegMinSec(21, 42, 0));
        const localDate = moment().utc().year(2010).month(7).date(24).hour(0).minute(0).second(0).millisecond(0);
        const geographicCoordinate = new GeographicCoordinate(30, 64);

        const expectedRiseAndSetTime = new RiseAndSetTime(14.271670, 4.166990);

        var actualRiseAndSetTime = CoordinateSystemService.getRiseAndSetTime(starEquatorialCoordinates, geographicCoordinate, localDate);
        expect(actualRiseAndSetTime.riseTime).toBeCloseTo(expectedRiseAndSetTime.riseTime, 4);
        expect(actualRiseAndSetTime.setTime).toBeCloseTo(expectedRiseAndSetTime.setTime, 4);
    });

    // angle conversion functions
    var toDecimalDegreesFromDegMinSec = function (degs, arcMins, arcSecs) {
        return (degs + (arcMins / 60.0) + (arcSecs / 3600.0));
    }
    var toDecimalDegreesFromHourMinSec = function (hours, mins, secs) {
        return (15 * (hours + (mins / 60.0) + (secs / 3600.0)));
    }
});