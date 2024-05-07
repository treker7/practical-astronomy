var moment = require('moment');

var HorizonCoordinate = require('../models/horizonCoordinate');
var EquatorialCoordinate = require('../models/equatorialCoordinate');
var ACS = require('./angleConversionService');
var TimeService = require('./timeService'); 
var MathService = require( './mathService');
var RiseAndSetTime = require('../models/riseAndSetTime');

/**
 * Class to convert between astronomical coordinate systems.
 */
class CoordinateSystemService {
    /**
     * Convert an equatorial coordinate to a horizon coordinate given a geographic posion and date/time.
     * Derived from Practical Astronomy With Your Calculator 4th edition section 25
     * @param {EquatorialCoordinate} equatorialCoordinate - the equatorial coordinate with RA/DEC to convert
     * @param {GeographicCoordinate} geographicCoordinate - the local position of observation
     * @param {Moment} localDate - the local time of observation
     * @returns {HorizonCoordinate} - the converted coordinate
     */
    static convertFromEquatorialToHorizonCoordinate(equatorialCoordinate, geographicCoordinate, localDate) {
        var dec = ACS.d2r(equatorialCoordinate.declination); // declination in radians
        var lat = ACS.d2r(geographicCoordinate.latitude); // latitude in radians
        // steps 1 - 3
        var hourAngle = ACS.h2r(CoordinateSystemService.getHourAngle(equatorialCoordinate, geographicCoordinate, localDate)); // get hour angle in radians
        // step 4
        var altitude = (Math.sin(dec) * Math.sin(lat)) + (Math.cos(dec) * Math.cos(lat) * Math.cos(hourAngle));
        // step 5
        altitude = Math.asin(altitude);
        // step 6
        var azimuth = (Math.sin(dec) - (Math.sin(lat) * Math.sin(altitude))) /
            (Math.cos(lat) * Math.cos(altitude));
        // step 7
        azimuth = Math.acos(azimuth);
        // step 8
        if (Math.sin(hourAngle) > 0) {
            azimuth = (2 * Math.PI) - azimuth;
        }
        // step 9
        return new HorizonCoordinate(ACS.r2d(azimuth), ACS.r2d(altitude));
    }

    /**
     * Convert a star's right ascension to its' hour angle.
     * Derived from Practical Astronomy With Your Calculator 4th edition section 24.
     * @param {EquatorialCoordinate} equatorialCoordinate - the equatorial coordinate of the object
     * @param {GeographicCoordinate} - the lat/long of the observation
     * @param {Moment} localDate - the local date of the observation
     * @returns {number} - the star's hours angle in decimal hours
     */
    static getHourAngle(equatorialCoordinate, geographicCoordinate, localDate) {
        // steps 1 - 4
        var localSiderealTime = TimeService.getLST(geographicCoordinate, localDate);
        // step 5
        var hourAngle = localSiderealTime - ACS.d2h(equatorialCoordinate.rightAscension);

        if (hourAngle < 0) {
            hourAngle += 24;
        }
        return hourAngle;
    }

    /**
     * Convert an Ecliptic Coordinate to an Equatorial Coordinate.
     * Derived from Practical Astronomy With Your Calculator 4th edition section 27.
     * @param {EclipticCoordinate} eclipticCoordinate - the ecliptic coordinate to convert
     * @param {Moment} localDate - the local date
     * @returns {EquatorialCoordinate} - the converted coordinate
     */
    static convertFromEclipticToEquatorialCoordinate(eclipticCoordinate, localDate) {
        var lambda = ACS.d2r(eclipticCoordinate.longitude);
        var beta = ACS.d2r(eclipticCoordinate.latitude);
        // steps 1 and 2
        var eclipticObliquity = ACS.d2r(CoordinateSystemService.getEclipticObliquity(localDate));
        var delta = (Math.sin(beta) * Math.cos(eclipticObliquity)) + (Math.cos(beta) * Math.sin(eclipticObliquity) * Math.sin(lambda));
        // step 3
        delta = ACS.r2d(Math.asin(delta));

        // step 4
        var y = (Math.sin(lambda) * Math.cos(eclipticObliquity)) - (Math.tan(beta) * Math.sin(eclipticObliquity));
        // step 5
        var x = Math.cos(lambda);
        // steps 6 and 7
        var alpha = ACS.r2d(Math.atan2(y, x));
        alpha = MathService.putInRange(alpha, 360);

        return new EquatorialCoordinate(alpha, delta);
    }

    /**
     * Calculate the ecliptic obliquity (i.e. the angle between the planes of the equator and the ecliptic) given the local date.
     * Derived from Practical Astronomy With Your Calculator 4th edition section 27.
     * @param {Moment} localDate - the local date
     * @returns {number} - the ecliptic obliquity in decimal degrees
     */
    static getEclipticObliquity(localDate) {
        // step 1
        var julianDate = TimeService.getJulianDate(localDate);
        // step 2
        julianDate -= 2451545.0;
        // step 3
        var t = julianDate / 36525.0;
        // step 4
        var de = (46.815 * t) + (0.0006 * Math.pow(t, 2)) - (0.0018 * Math.pow(t, 3));
        // step 5
        de /= 3600.0;
        // step 6
        var eclipticObliquity = 23.439292 - de;
        return eclipticObliquity;
    }

    /**
     * Calculate the rise and set times of an astronomical object given it's equatorial coordinates and the viewer's geographic location.
     * If the astronomical object never rises above the horizon or is circumpolar this method will return NaN
     * Derived from Practical Astronomy With Your Calculator 4th edition section 33.
     * @param {EquatorialCoordinate} equatorialCoordinate - the equatorial coordinate of the astronomical object
     * @param {GeographicCoordinate} geographicCoordinate - the geographic coordinate of the viewer's location on the Earth's surface
     * @param {Moment} localDate - the local date of the observer
     * @param {number} verticalShift - the vertical shift due to atmospheric refraction, parallax, etc. in decimal degrees
     * @returns {RiseAndSetTime} - the rise and set times of the astronomical object
     */
    static getRiseAndSetTime(equatorialCoordinate, geographicCoordinate, localDate, verticalShift = (34 / 60)) {
        // step 1
        var alpha = ACS.d2r(equatorialCoordinate.rightAscension);
        var delta = ACS.d2r(equatorialCoordinate.declination);

        var theta = ACS.d2r(geographicCoordinate.latitude);
        // step 2
        var h = - (Math.sin(ACS.d2r(verticalShift)) + (Math.sin(theta) * Math.sin(delta))) /
                          (Math.cos(theta) * Math.cos(delta));
        // step 3
        if (h > 1) { // star is circumpolar so it never sets
            return new RiseAndSetTime(0, NaN);
        }
        else if (h < -1) { // star never rises above the horizon
            return new RiseAndSetTime(NaN, 0);
        }
        h = Math.acos(h);
        // step 4
        var lstRise = ACS.r2h(alpha) - ACS.r2h(h);
        lstRise = MathService.putInRange(lstRise, 24);
        // step 5
        var lstSet = ACS.r2h(alpha) + ACS.r2h(h);
        lstSet = MathService.putInRange(lstSet, 24);
        // we don't care about steps 6 and 7
        // step 8
        var gstRise = TimeService.convertLSTToGST(geographicCoordinate, lstRise);
        var localRise = TimeService.convertGSTToLocalHours(localDate, gstRise);

        var gstSet = TimeService.convertLSTToGST(geographicCoordinate, lstSet);
        var localSet = TimeService.convertGSTToLocalHours(localDate, gstSet);

        return new RiseAndSetTime(localRise, localSet);
    }

    /**
     * Get an array of horizon coordinates from an astronomical object given a geographic posion and date/time start and stop.
     * @param {AstronomicalObject} astronomicalObject - the astronomical object with RA/DEC
     * @param {GeographicCoordinate} geographiCoordinate - the local position of observation
     * @param {Moment} localDateStart - the local starting date of the observations
     * @param {Moment} localDateStop - the local stopping date of the observations
     * @param {number} numCoordinates - the number of horizon coordinates to calculate and return
     * @returns {HorizonCoordinate[]} - the array of 1,000 horizon coordinates
     */
    static getHorizonCoordinates(astronomicalObject, geographiCoordinate, localDateStart, localDateStop, numCoordinates = 1500) {
        var secondsDelta = (moment.duration(localDateStop.diff(localDateStart)).asSeconds()) / numCoordinates; // seconds difference between successive datapoints
        var currDate = localDateStart.clone(); // copy date object

        var horizonCoordinates = [];
        for (var i = 0; i < numCoordinates; i++) {
            let currEquatorialCoordinate = astronomicalObject.getEquatorialCoordinate(currDate);
            horizonCoordinates.push(CoordinateSystemService.convertFromEquatorialToHorizonCoordinate(currEquatorialCoordinate, geographiCoordinate, currDate));            
            currDate.add(secondsDelta, "seconds");
        }
        return horizonCoordinates;
    }
}

module.exports = CoordinateSystemService;