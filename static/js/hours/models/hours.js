/**
 * This class represents the hours object that is expected by hours formatters.
 */
export default class Hours {
  constructor(config = {}) {
    /**
     * @type {Object[]}
     */
    this.days = config.days;

    this.today = {
      /**
       * @type {number}
       */
      time: config.today.time,

      /**
       * @type {DayNames}
       */
      day: config.today.day,
    };

    this.openStatus = {
      /**
       * @type {OpenStatusTypes}
       */
      status: config.openStatus.status,

      /**
       * @type {DayNames}
       */
      nextDay: config.openStatus.nextDay,

      /**
       * @type {number}
       */
      nextTime: config.openStatus.nextTime,
    }
  }

  /**
   * Returns an array of the days beginning with the dayName provided
   *
   * @param {DayName} dayName
   * @returns {Object[]} sortedDays
   */
  getSortedDaysStartingFrom(dayName) {
    const startingIndex = this._getIndexForDay(dayName);
    if (startingIndex < 0) {
      return this.days;
    }

    const partA = this.days.slice(startingIndex);
    const partB = this.days.slice(0, startingIndex);
    return partA.concat(partB);
  }

  /**
   * Returns the index of the day in this.days, or -1 if not found
   *
   * @param {DayName} dayName
   */
  _getIndexForDay(dayName) {
    for (let i = 0; i < this.days.length; i++) {
      if (this.days[i].day == dayName) {
        return i;
      }
    }
    return -1;
  }
}
