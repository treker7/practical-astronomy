var ACS = require('./angleConversionService');
var MathService = require('./mathService');

/**
 * A class for computing and converting times in the formats LST, GST, UTC, etc.
 */
class TimeService {
    /**
     * Get the Local Siderial Time (LST) given the local date and the observer's geographic location.
     * Derived from Practical Astronomy With Your Calculator 4th edition section 14.
     * @param {GeographicCoordinate} geographicCoordinate - the local position of observation
     * @param {Moment} localDate - the local date of observation
     * @returns {number} - The LST in decimal hours
     */
    static getLST(geographicCoordinate, localDate) {
        var greenwichSiderealTime = TimeService.getGST(localDate);

        var localSiderealTime = greenwichSiderealTime + ACS.d2h(geographicCoordinate.longitude);
        localSiderealTime = MathService.putInRange(localSiderealTime, 24);

        return localSiderealTime;
    }

    /**
     * Get the Greenwich Sidereal Time (GST) in decimal hours
     * Derived from Practical Astronomy With Your Calculator 4th edition section 12.
     * @param {Moment} localDate - the local date of observation
     * @returns {number} - the GST in decimal hours
     */
    static getGST(localDate) {
        var julianDate = TimeService.getJulianDate(localDate.clone().utc().hour(0).minute(0).second(0).millisecond(0));

        //Steps 1, 2, and 3
        const j2000Startconstant = 2451545.0;
        var t = (julianDate - j2000Startconstant) / 36525.0;
        // Step 4
        const a = 6.697374558, b = 2400.051336, c = 0.000025862;
        var tZero = a + (b * t) + (c * Math.pow(t, 2));
        tZero = MathService.putInRange(tZero, 24);

        // Step 5
        var utcDate = localDate.clone().utc();
        var hour = utcDate.hour() + (utcDate.minute() / 60) + (utcDate.second() / 3600) + (utcDate.millisecond() / 3600000);
        // steps 6 - 7
        const gstStep6constant = 1.002737909;
        var greenwichSiderealTime = (hour * gstStep6constant) + tZero;
        greenwichSiderealTime = MathService.putInRange(greenwichSiderealTime, 24);

        return greenwichSiderealTime;
    }

    /**
     * Convert the Local Sidereal Time (LST) to Greenwich Sidereal Time (GST).
     * Derived from Practical Astronomy With Your Calculator 4th edition section 15.
     * @param {GeographicCoordinate} geographicCoordinate - the local position of observation (lat/long)
     * @param {number} lst - the Local Sidereal Time in decimal hours
     * @returns {number} - the Greenwich Sidereal Time in decimal hours
     */
    static convertLSTToGST(geographicCoordinate, lst) {
        // steps 1 and 2
        var hours = geographicCoordinate.longitude / 15.0;
        // step 3
        var gst = lst - hours;
        gst = MathService.putInRange(gst, 24);
        return gst;
    }

    /**
     * Convert the Greenwich Sidereal Time (GST) to Coordinated Universal Time (UTC).
     * Derived from Practical Astronomy With Your Calculator 4th edition section 13.
     * @param {Moment} localDate - the local date of observation
     * @param {number} gst - the Greenwich Sidereal Time in decimal hours
     * @returns {number} - the Local Hours in decimal hours
     */
    static convertGSTToLocalHours(localDate, gst) {
        // step 1
        var julianDate = TimeService.getJulianDate(localDate.clone().utc().hour(0).minute(0).second(0).millisecond(0));
        // step 2
        var s = julianDate - 2451545.0;
        // step 3
        var t = s / 36525.0;
        // step 4
        const a = 6.697374558, b = 2400.051336, c = 0.000025862;
        var tZero = a + (b * t) + (c * Math.pow(t, 2));
        tZero = MathService.putInRange(tZero, 24);
        // steps 5 and 6
        var utcHours = gst - tZero;
        utcHours = MathService.putInRange(utcHours, 24);
        // step 7
        utcHours *= .9972695663;
        // convert to local hours
        var localHours = utcHours + (localDate.utcOffset() / 60.0);
        localHours = MathService.putInRange(localHours, 24);

        return localHours;
    }

    /**
     * Returns the Julian Date (the number of decimal days since noon on January 1, 4713 BC).
     * Derived from Practical Astronomy With Your Calculator 4th edition section 4.
     * @param {Moment} localDate - the local date
     * @returns {number} - the Julian Date in decimal days
     */
    static getJulianDate(localDate) {
        //Step 1
        var utcDate = localDate.clone().utc();
        var year = utcDate.year();
        var month = (utcDate.month() + 1);
        var day = utcDate.date() + (utcDate.hour() / 24) + (utcDate.minute() / (60 * 24)) + (utcDate.second() / (3600 * 24)) + (utcDate.millisecond() / (3600000 * 24));
        //Step 2
        if ((month == 1) || (month == 2)) {
            year -= 1;
            month += 12;
        }
        //Step 3
        var a = Math.trunc(year / 100.0);
        var b = 2 - a + Math.trunc(a / 4.0);
        //Step 4
        var c = Math.trunc(365.25 * year);
        //Step 5
        var d = Math.trunc(30.6001 * (month + 1));
        //Step 6
        const julianDateStep6constant = 1720994.5;
        var jd = (b + c + d + day + julianDateStep6constant);

        return jd;
    }
}

module.exports = TimeService;