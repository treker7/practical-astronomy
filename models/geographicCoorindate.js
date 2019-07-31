/**
 * Class for representing a position on the Earth's surface.
 */
export class GeographicCoordinate {
    /**
     * Construct a geographic coordinate given lat/long.
     * @param {number} latitude - the latitude in decimal degrees
     * @param {number} longitude - the longitude in decimal degrees
     */
    constructor(latitude, longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }
}