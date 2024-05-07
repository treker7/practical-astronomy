var moment = require('moment');

var MathService = require('./mathService');
var ACS = require('./angleConversionService');
var CoordinateSystemService = require('./coordinateSystemService');
var EclipticCoordinate = require('../models/eclipticCoordinate');
var AstronomicalObject = require('../models/astronomicalObject');
/**
 * A class for calculating the sun's positions and rise/set times.
 */
class Sun extends AstronomicalObject {
    constructor() {
        super(null, null, "Sun");
        this.localDateToEquatorialCoordinatesCache = new Map();
    }

    /**
     * Get the sun's equatorial coordinates at the specified local date.
     * Derived from Practical Astronomy With Your Calculator 4th edition section 46.
     * @override
     * @param {Moment} localDate - the local date
     * @returns {EquatorialCoordinate} - the equatorial coordinates of the sun
     */
    getEquatorialCoordinate(localDate) {
        var key = (localDate.unix());
        // check the cache
        if (this.localDateToEquatorialCoordinatesCache.has(key)) {
            return this.localDateToEquatorialCoordinatesCache.get(key);
        }

        // steps 1 - 3
        var n = this.getN(localDate);
        // step 4
        var meanAnomaly = this.getMeanAnomaly(n);
        // steps 5 - 6
        var eclipticLongitude = this.getEclipticLongitude(meanAnomaly, n);
        // step 7
        var sunEclipticCoordinate = new EclipticCoordinate(0, eclipticLongitude);
        var equatorialCoordinate = CoordinateSystemService.convertFromEclipticToEquatorialCoordinate(sunEclipticCoordinate, localDate);

        // cache this result
        this.localDateToEquatorialCoordinatesCache.set(key, equatorialCoordinate);

        return equatorialCoordinate;
    }

    /**
     * Get the sun variable N given the local date
     * Derived from Practical Astronomy With Your Calculator 4th edition section 49.
     * @param {any} localDate - the local date
     * @return {number} - the variable N
     */
    getN(localDate) {
        // step 1
        var daysSinceEpoch = localDate.dayOfYear();
        // step 2
        daysSinceEpoch += moment.duration(localDate.clone().dayOfYear(1).diff(Sun.getEpoch2010())).asDays();
        // step 3
        var n = (360.0 / (365.242191)) * daysSinceEpoch;
        return MathService.putInRange(n, 360);
    }
    /**
     * Get the sun's mean anomaly given n
     * Derived from Practical Astronomy With Your Calculator 4th edition section 49.
     * @param {number} n - the value n
     * @returns {number} - the mean anomaly of the sun
     */
    getMeanAnomaly(n) {
        // step 4
        var meanAnomaly = (n + Sun.getEclipticLongitudeAtEpoch2010()) - Sun.getEclipticLongitudeOfPerigeeAtEpoch2010();
        if (meanAnomaly < 0) {
            meanAnomaly += 360;
        }
        return meanAnomaly;
    }

    /**
     * Get the sun's ecliptic longitude (lambda) given the local date
     * Derived from Practical Astronomy With Your Calculator 4th edition section 49.
     * @param {number} meanAnomaly - the mean anomaly of the sun
     * @param {number} n - the value n
     * @returns {number} - the ecliptic longitude of the sun in decimal degrees
     */
    getEclipticLongitude(meanAnomaly, n) {
        // step 5
        var ec = (360.0 / Math.PI) * Sun.getEccentricityOfOrbitAtEpoch2010() * Math.sin(ACS.d2r(meanAnomaly));
        // step 6
        var sunLongitude = n + ec + Sun.getEclipticLongitudeAtEpoch2010();
        if (sunLongitude > 360) {
            sunLongitude -= 360;
        }
        return sunLongitude;
    }

    /**
     * Get the sun's rise and set times in local hours.
     * This method returns null if the sun never rises or sets at the specified location
     * Derived from Practical Astronomy With Your Calculator 4th edition section 49.
     * @param {GeographicCoordinate} geographicCoordinate - the geographic coordinate of the observer on the earth's surface
     * @param {Moment} localDate - the local date of the observer
     * @returns {RiseAndSetTime} - the rise and set times of the sun, or null if the sun never rises or sets
     */
    getRiseAndSetTime(geographicCoordinate, localDate) {
        const ATMOSPHERIC_REFRACTION = (34 / 60.0); // atmospheric refraction in decimal degrees
        const PARALLAX = (8.79 / 3600); // parallax in decimal degrees
        var sunVerticalShift = ATMOSPHERIC_REFRACTION + (Sun.getAngularDiameter() / 2) + PARALLAX;

        // step 1
        var zeroTime = localDate.clone().hour(0).minute(0).second(0).millisecond(0);
        var noon = zeroTime.clone().add(12, "hours");
        var sunEquatorialCoordinatesAtNoon = this.getEquatorialCoordinate(noon);
        // step 2
        var meanSunRiseAndSetTime = CoordinateSystemService.getRiseAndSetTime(sunEquatorialCoordinatesAtNoon, geographicCoordinate, noon, sunVerticalShift);

        return meanSunRiseAndSetTime;
    }

    /**
     * Get the duration of twilight given the observer's geographic coordinates, the local date, and the specified twilight angle.
     * Derived from Practical Astronomy With Your Calculator 4th edition section 50.
     * @param {GeographicCoordinate} geographicCoordinate - the geographic coordinate of the observer on the earth's surface
     * @param {Moment} localDate - the local date
     * @param {number} twilightAngle - the angle of the desired twilight duration (96 for civil twilight, 102 for nautical twilight, 108 for astronomical twilight)
     * @returns {number} the time of the specified twilight in decimal hours or NaN
     */
    getTwilightTime(geographicCoordinate, localDate, twilightAngle = 108) {
        // step 1
        var currEquatorialCoordinate = this.getEquatorialCoordinate(localDate.clone().hour(12).minute(0).second(0).millisecond(0));
        var latitude = ACS.d2r(geographicCoordinate.latitude);
        var declination = ACS.d2r(currEquatorialCoordinate.declination);

        // step 2
        var hourAngle = Math.acos(-1 * Math.tan(latitude) * Math.tan(declination));
        // step 3
        var hourAngleAtTwilight = Math.acos((Math.cos(ACS.d2r(twilightAngle)) - (Math.sin(latitude) * Math.sin(declination))) /
            (Math.cos(latitude) * Math.cos(declination)));
        // step 4
        var time = (((ACS.r2d(hourAngleAtTwilight) - ACS.r2d(hourAngle)) / 15.0) * 0.9972695659722222);
        return time;
    }

    // sun constants (angles are in decimal degrees)
    static getAngularDiameter() { return 0.533; } // angular diameter of the sun
    static getEpoch2010() { return moment().utcOffset(0).year(2010).dayOfYear(1).hour(0).minute(0).second(0).millisecond(0); }
    static getEclipticLongitudeAtEpoch2010() { return 279.557208; }
    static getEclipticLongitudeOfPerigeeAtEpoch2010() { return 283.112438; }
    static getEccentricityOfOrbitAtEpoch2010() { return 0.016705; }    
}

// export singleton
module.exports = new Sun();