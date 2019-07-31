/**
 * A class for representing an Equatorial Coordinate
 */
export class EquatorialCoordinate {
    /**
     * Construct an Equatorial Coordinate given right ascension and declination
     * @param {number} rightAscension - the RA in decimal degrees
     * @param {number} declination - the DEC in decimal degrees
     */
    constructor(rightAscension, declination) {
        this.rightAscension = rightAscension;
        this.declination = declination;
    }
}