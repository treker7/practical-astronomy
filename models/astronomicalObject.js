var { EquatorialCoordinate } = require('./equatorialCoordinate');

/**
 * Class for representing an astronomical object in space.
 */
class AstronomicalObject {
    /**
     * Construct an astronomical object.
     * @param {number} rightAscension - the RA in decimal degrees
     * @param {number} declination - the DEC in decimal degrees
     * @param {string} identifier - the object's identifier
     */
    constructor(rightAscension, declination, identifier) {
        this.rightAscension = rightAscension;
        this.declination = declination;
        this.identifier = identifier;        
    }

    /**
     * Get the object's equatorial coordinates
     * @returns {EquatorialCoordinate} - the equatorial coordinates of the object
     */
    getEquatorialCoordinate() {
        return new EquatorialCoordinate(this.rightAscension, this.declination);
    }
}

module.exports = AstronomicalObject;