var moment = require('moment');

var sun = require('./sunService');
var CoordinateSystemService = require('./coordinateSystemService');
var ACS = require('./angleConversionService');
var MathService = require('./mathService');
var EclipticCoordinate = require('../models/eclipticCoordinate');
var AstronomicalObject = require('../models/astronomicalObject');

/**
 * A class for calculating the position and phases of the moon.
 */
class Moon extends AstronomicalObject {
    constructor() {
        super(null, null, "Moon");
        this.localDateToEquatorialCoordinatesCache = new Map();
    }

    /**
     * Get the moon's equatorial coordinates at the specified local date.
     * Derived from Practical Astronomy With Your Calculator 4th edition section 65.
     * @override
     * @param {Moment} localDate - the local date
     * @returns {EquatorialCoordinate} - the equatorial coordinates of the moon
     */
    getEquatorialCoordinate(localDate) {
        var key = (localDate.unix());
        // check the cache
        if (this.localDateToEquatorialCoordinatesCache.has(key)) {
            return this.localDateToEquatorialCoordinatesCache.get(key);
        }

        // steps 1 - 14
        var moonLongitudeAndLongitueOfNode = this.getLongitudeAndLongitudeOfNode(localDate);
        var moonLongitude = moonLongitudeAndLongitueOfNode[0];
        var longitudeOfNode = moonLongitudeAndLongitueOfNode[1];

        // step 15
        var y = Math.sin(ACS.d2r(moonLongitude - longitudeOfNode)) * Math.cos(ACS.d2r(Moon.getInclinationOfOrbit()));
        // step 16
        var x = Math.cos(ACS.d2r(moonLongitude - longitudeOfNode));
        // steps 17 and 18
        var moonEclipticLongitude = ACS.r2d(Math.atan2(y, x)) + longitudeOfNode;
        // step 19
        var moonEclipticLatitude = ACS.r2d(Math.asin(Math.sin(ACS.d2r(moonLongitude - longitudeOfNode)) * Math.sin(ACS.d2r(Moon.getInclinationOfOrbit()))));
        // step 20
        var equatorialCoordinate = CoordinateSystemService.convertFromEclipticToEquatorialCoordinate(new EclipticCoordinate(moonEclipticLatitude, moonEclipticLongitude), localDate);

        // cache this result
        this.localDateToEquatorialCoordinatesCache.set(key, equatorialCoordinate);

        return equatorialCoordinate;
    }

    /**
     * Get the phase of the moon (i.e. the percent illumination of the moon viewed from earth) given the local date of the observer.
     * Derived from Practical Astronomy With Your Calculator 4th edition section 67.
     * @param {any} localDate - the local date
     * @returns {number} - the phase of the moon as a fraction of 1
     */
    getPhase(localDate) {
        // step 1
        var sunN = sun.getN(localDate);
        var sunMeanAnomaly = sun.getMeanAnomaly(sunN);
        var sunEclipticLongitude = sun.getEclipticLongitude(sunMeanAnomaly, sunN);

        var moonLongitude = this.getLongitudeAndLongitudeOfNode(localDate)[0];
        // step 2
        var d = moonLongitude - sunEclipticLongitude;
        // step 3
        var f = (0.5 * (1 - Math.cos(ACS.d2r(d))));
        return f;
    }

    /**
     * Get the moon's longitude and the longitude of its' node in decimal degrees given the local date.
     * Derived from Practical Astronomy With Your Calculator 4th edition section 65.
     * @param {Moment} localDate - the local date
     * @returns {number[]} - an array with the moon's longitude as its first element and the longitude of the moon's node as its second element (both in decimal degrees)
     */
    getLongitudeAndLongitudeOfNode(localDate) {
        // step 1
        var daysSinceEpoch = localDate.dayOfYear();
        daysSinceEpoch += moment.duration(localDate.clone().dayOfYear(1).diff(Moon.getEpoch2010())).asDays();

        // step 2
        var sunN = sun.getN(localDate);
        var sunMeanAnomaly = sun.getMeanAnomaly(sunN);
        var sunEclipticLongitude = sun.getEclipticLongitude(sunMeanAnomaly, sunN);
        // step 3
        var moonMeanLongitude = (13.1763966 * daysSinceEpoch) + Moon.getMeanLongitudeAtEpoch2010();
        moonMeanLongitude = MathService.putInRange(moonMeanLongitude, 360);
        // step 4
        var moonMeanAnomaly = moonMeanLongitude - (0.1114041 * daysSinceEpoch) - Moon.getmeanLongitudeOfPerigeeAtEpoch2010();
        moonMeanAnomaly = MathService.putInRange(moonMeanAnomaly, 360);
        // step 5
        var meanLongitudeOfNode = Moon.getMeanLongitudeOfNodeAtEpoch2010() - (0.0529539 * daysSinceEpoch);
        meanLongitudeOfNode = MathService.putInRange(meanLongitudeOfNode, 360);
        // step 6
        var c = moonMeanLongitude - sunEclipticLongitude;
        var evection = 1.2739 * Math.sin(ACS.d2r((2 * c) - moonMeanAnomaly));
        // step 7
        var annualEquation = 0.1858 * Math.sin(ACS.d2r(sunMeanAnomaly));
        var correction3 = 0.37 * Math.sin(ACS.d2r(sunMeanAnomaly));
        // step 8
        var moonAnomaly = moonMeanAnomaly + evection - annualEquation - correction3;
        // step 9
        var equationOfCentre = 6.2886 * Math.sin(ACS.d2r(moonAnomaly));
        // step 10
        var correction4 = 0.214 * Math.sin(ACS.d2r(2 * moonAnomaly));
        // step 11
        var moonLongitude = moonMeanLongitude + evection + equationOfCentre - annualEquation + correction4;
        // step 12
        var variation = 0.6583 * Math.sin(ACS.d2r(2 * (moonLongitude - sunEclipticLongitude)));
        // step 13
        moonLongitude = moonLongitude + variation;
        // step 14
        var longitudeOfNode = meanLongitudeOfNode - (0.16 * Math.sin(ACS.d2r(sunMeanAnomaly)));

        return [moonLongitude, longitudeOfNode];
    }

    // moon constants (angles are in decimal degrees)
    static getEpoch2010() { return moment().utcOffset(0).year(2010).dayOfYear(1).hour(0).minute(0).second(0).millisecond(0); }
    static getMeanLongitudeAtEpoch2010() { return 91.929336; }
    static getmeanLongitudeOfPerigeeAtEpoch2010() { return 130.143076; }
    static getMeanLongitudeOfNodeAtEpoch2010() { return 291.682547; }
    static getInclinationOfOrbit() { return 5.145396; }
}

// export singleton
module.exports = new Moon();