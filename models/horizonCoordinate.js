/**
 * Class for representing the observed position of an object on the celestial sphere.
 */
class HorizonCoordinate {
    /**
     * Construct a horizon coordinate given az/alt.
     * @param {number} azimuth - the azimuth in decimal degrees
     * @param {number} altitude - the altitude in decimal degrees
     */
    constructor(azimuth, altitude) {
        this.azimuth = azimuth;
        this.altitude = altitude;
    }
}

module.exports = HorizonCoordinate;