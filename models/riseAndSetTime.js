/**
 * A class for representing the rise and set times in decimal hours of an astronomical object.
 */
export class RiseAndSetTime {
    /**
     * Construct a RiseAndSetTime object from the given rise and set times
     * @param {number} riseTime - the rise time in decimal hours
     * @param {number} setTime - the set time in decimal hours
     */
    constructor(riseTime, setTime) {
        this.riseTime = riseTime;
        this.setTime = setTime;
    }
}