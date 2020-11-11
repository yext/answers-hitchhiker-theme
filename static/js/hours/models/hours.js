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
   * Returns the index of the day in this.days
   *
   * @param {DayName} dayName
   */
  getIndexForDay(dayName) {
    for (let i = 0; i < this.days.length; i++) {
      if (this.days[i].day == dayName) {
        return i;
      }
    }
  }
}
