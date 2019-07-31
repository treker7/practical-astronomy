/**
 * A class for converting angles to / from degrees, radians, and hours and displaying angles in various formats
 */
class AngleConversionService {
    /**
     * Convert an angle from radians to degrees.
     * @param {number} angle - the angle in radians
     * @returns {number} - the angle in degrees
     */
    static r2d(angle) {
        return angle * (180.0 / Math.PI);
    }
    /**
     * Convert an angle from degrees to radians.
     * @param {number} angle - the angle in degrees
     * @returns {number} - the angle in radians
     */
    static d2r(angle) {
        return angle * (Math.PI / 180.0);
    }
    /**
     * Convert an angle from decimal degrees to decimal hours.
     * @param {number} angle - the angle in degrees
     * @returns {number} - the ancle in decimal hours
     */
    static d2h(angle) {
        return angle / 15.0;
    }
    /**
     * Convert an angle from decimal hours to decimal degrees.
     * @param {number} angle - the angle in decimal hours
     * @returns {number} - the angle in decimal degrees
     */
    static h2d(angle) {
        return angle * 15.0;
    }

    /**
     * Convert an angle from decimal hours to radians.
     * @param {number} angle - the angle in decimal hours
     * @returns {number} - the angle in radians
     */
    static h2r(angle) {
        return ((angle * 15.0) * (Math.PI / 180.0));
    }

    /**
     * Convert an angle from radians to decimal hours.
     * @param {number} angle - the angle in radians
     * @returns {number} - the angle in decimal hours
     */
    static r2h(angle) {
        return ((angle * (180.0 / Math.PI)) / 15.0);
    }

    /**
     * Display a time or angle in hours, minutes, and seconds format.
     * @param {number} time - a time or angle in decimal hours or decimal degrees
     * @param {boolean} displaySign - whether or not to display the sign of the angle if it's positive
     * @returns {string} - the time or angle formatted as hours, minutes, and seconds
     */
    static displayAsDMS(time, displaySign = false) {
        var sign = "";
        if (displaySign) {
            sign = (time >= 0) ? "+" : "";
        }
        var wholeDegrees = Math.trunc(time);

        var minutes = Math.abs(time - wholeDegrees) * 60;
        var seconds = (minutes - Math.trunc(minutes)) * 60;

        var displayMinutes = Math.trunc(minutes);
        if (displayMinutes < 1) {
            displayMinutes = `00`;
        } else if (displayMinutes < 10) {
            displayMinutes = `0${displayMinutes}`;
        }

        var displaySeconds = Math.round(seconds);
        if (displaySeconds < 1) {
            displaySeconds = `00`;
        } else if (displaySeconds < 10) {
            displaySeconds = `0${displaySeconds}`;
        }
        return `${sign}${wholeDegrees}:${displayMinutes}:${displaySeconds}`;
    }

    /**
    * Display a time or angle in hours and minutes format.
    * @param {number} time - a time or angle in decimal hours or degrees
    * @returns {string} - the time or angle formatted as H:M
    */
    static displayAsHM(time) {
        var minutes = (time - Math.trunc(time)) * 60;

        var displayMinutes = Math.round(minutes);
        if (displayMinutes < 1) {
            displayMinutes = `00`;
        } else if (displayMinutes < 10) {
            displayMinutes = `0${displayMinutes}`;
        }
        return `${Math.trunc(time)}:${displayMinutes}`;
    }

    /**
    * Display an angle angle angle in hours, minutes and seconds format.
    * @param {number} angle - the angle in decimal degrees
    * @param {boolean} displaySign - whether or not to display the sign of the angle
    * @returns {string} - the angle formatted as hours, minutes, and seconds
    */
    static displayAsHMS(angle, displaySign = false) {
        var decimalHours = angle / 15.0;

        return AngleConversionService.displayAsDMS(decimalHours, displaySign);
    }

    /**
     * Parse a time or angle in D:M:S.S format and return the result in decimal hours.
     * @param {string} angleDMS - the time or angle in D:M:S.S format
     * @returns {number} - the result in decimal hours
     */
    static parseDMS(angleDMS) {
        var sign = 1;
        if (angleDMS[0] == "-") {
            sign = -1;
        }
        var hmsParts = angleDMS.split(":");  

        var hours = Math.abs(hmsParts[0]);
        var minutes = hmsParts[1] || 0;
        var seconds = hmsParts[2] || 0;

        hours = parseInt(hours);
        minutes = parseInt(minutes);
        seconds = parseFloat(seconds);

        return ((hours + (minutes / 60.0) + (seconds / 3600.0) ) * sign);
        
    }

    /**
     * Parse a time or angle in H:M:S.S format and return the result in decimal hours.
     * @param {string} angleHMS - the time or angle in H:M:S.S format
     * @returns {number} - the result in decimal hours
     */
    static parseHMS(angleHMS) {
        return (15 * (AngleConversionService.parseDMS(angleHMS)));
    }    
}

module.exports = AngleConversionService;