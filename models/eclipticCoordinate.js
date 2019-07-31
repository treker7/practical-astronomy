/**
 * A class for representing an ecliptic coordinate (i.e. a positon in the solar system)
 */
export class EclipticCoordinate {
    /**
     * Construct an Ecliptic Coordinate given ecliptic lat/long
     * @param {number} latitude - the ecliptic latitude in decimal degrees
     * @param {number} longitude - the ecliptic longitude in decimal degrees
     */
    constructor(latitude, longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }
}