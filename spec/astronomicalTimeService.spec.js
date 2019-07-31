/*
 * AstronomicalTimeService Tests
 * 
 * Some LST and GST data is taken from http://aa.usno.navy.mil/data/docs/siderealtime.php
 * Julian Date data is taken from http://neoprogrammics.com/sidereal_time_calculator/index.php
 * Two dates are tested:
 * 12:00 a.m. on Januray 1st, 2015
 * 12:00 p.m. on July 4th, 2035
 */

var moment = require("./../node_modules/moment");

var TimeService = require("../services/timeService");
var GeographicCoordinate = require("../models/geographicCoorindate");
var DEFAULT_LOCATION = require("../config/defaultLocation");

describe("AstronomicalTimeService", function () {
    const midnightJanuary2017 = moment(new Date(2017, 0, 1, 0, 0, 0, 0));
    const noonJuly4th2019 = moment(new Date(2019, 6, 4, 12, 0, 0, 0));
    const stPrecision = 2;
    const jdPrecision = 2;

    beforeEach(function () {

    });

    it("Calculates the local sidereal time on 1/1/17 @ 5:00", function () {
        var actualLST = TimeService.getLST(DEFAULT_LOCATION, midnightJanuary2017);
        const expectedLST = 6.3966523333; 
        expect(actualLST).toBeCloseTo(expectedLST, stPrecision);
    });

    it("Calculates the local sidereal time on 7/4/19 @ 12:00", function () {
        var actualLST = TimeService.getLST(DEFAULT_LOCATION, noonJuly4th2019);
        const expectedLST = 5.485548944;
        expect(actualLST).toBeCloseTo(expectedLST, stPrecision);
    });

    it("Calculates the Greenwich sidereal time on 1/1/17 @ 0:00", function () {
        var actualGST = TimeService.getGST(midnightJanuary2017);
        const expectedGST = 11.736219;
        expect(actualGST).toBeCloseTo(expectedGST, stPrecision);
    });

    it("Calculates the Greenwich sidereal time on 7/4/19 @ 12:00", function () {
        var actualGST = TimeService.getGST(noonJuly4th2019);
        const expectedGST = 10.8251156111;
        expect(actualGST).toBeCloseTo(expectedGST, stPrecision);
    });

    it("Calculates the Julian Date on 1/1/17 @ 0:00", function () {
        var actualJulianDate = TimeService.getJulianDate(midnightJanuary2017);
        const expectedJulianDate = 2457754.709131944444;
        expect(actualJulianDate).toBeCloseTo(expectedJulianDate, jdPrecision);
    });
    
    it("Calculates the Julian Date on 7/4/19 @ 12:00", function () {
        var actualJulianDate = TimeService.getJulianDate(noonJuly4th2019);
        const expectedJulianDate = 2458669.167465277778; 
        expect(actualJulianDate).toBeCloseTo(expectedJulianDate, jdPrecision);
    });

    // From Practical Astronomy With Your Calculator 4th Edition Section 13.
    it("Converts GST to Local Hours correctly", function () {
        const localDate = moment().year(1980).month(3).date(22).hour(0).minute(0).second(0).millisecond(0);
        const gst = 4.668119;

        const expectedLocalHours = 10.614353;
        var actualLocalHours = TimeService.convertGSTToLocalHours(localDate, gst);
        expect(actualLocalHours).toBeCloseTo(expectedLocalHours, 4);
    });

    // From Practical Astronomy With Your Calculator 4th Edition Section 15.
    it("Converts LST to GST correctly", function () {
        const geographicCoordinate = new GeographicCoordinate(0, -64.0);
        const lstHours = .401453;

        const expectedGST = 4.668119;
        var actualGST = TimeService.convertLSTToGST(geographicCoordinate, lstHours);
        expect(actualGST).toBeCloseTo(expectedGST, 4);
    });
});
