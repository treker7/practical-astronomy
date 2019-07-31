/**
 * A class for basic mathematical calculations.
 */
class MathService {
    /**
     * Put an integer x in a range [0, r) by adding/subtracting multiples of r.
     * @param {number} x - the number to put in the range
     * @param {number} r - the range
     * @return {number} - the number in the specified range
     */
    static putInRange(x, r) {
        if (x > r) {
            return (x % r);
        }
        else if (x < 0) {
            return (r + (x % r));
        } else {
            return x;
        }
    }

    /**
     * Determine whether or not two HorizonCoordinates are within a specified angular distance from each other.
     * @param {HorizonCoordinate} horizonCoordinate1 - the first horizon coordinate
     * @param {HorizonCoordinate} horizonCoordinate2 - the second horizon coordinate
     * @param {number} degreesRadius - the angular distance in decimal degrees
     * @returns {boolean} - true if the if the horizon coordinates are within the specified anuglar distance
     */
    static areWithinRadius(horizonCoordinate1, horizonCoordinate2, degreesRadius = 30) {
        var azimuthDelta = horizonCoordinate1.azimuth - horizonCoordinate2.azimuth;
        var altitudeDelta = horizonCoordinate1.altitude - horizonCoordinate2.altitude;

        var degreesDeltaSquared = Math.pow(azimuthDelta, 2) + Math.pow(altitudeDelta, 2);

        return (degreesDeltaSquared < Math.pow(degreesRadius, 2));
    }
}

module.exports = MathService;