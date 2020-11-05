import OpenStatusMessageFactory from './messagefactory';
import OpenStatusTransformer from './transformer';

export default class OpenStatusFormatter {
  /**
   * Returns a string, a formatted representation of the open hours status
   * for the given hours field.
   *
   * @param {Object} hoursField The profile field that contains the hours data
   * @param {String} timeZoneUtcOffset e.g. in EDT, GMT-0400, this value would be "-04:00"
   * @param {boolean} isTwentyFourHourClock Use 24 hour clock if true, 12 hour clock
   *                  if false. Default based on locale if undefined.
   * @param {String} locale The locale for the time string
   */
  static format({ hoursField, timeZoneUtcOffset, isTwentyFourHourClock, locale }) {
    const hoursToday = new OpenStatusTransformer(timeZoneUtcOffset).transform(hoursField);
    if (!hoursToday) {
      return '';
    }

    return OpenStatusMessageFactory.create({
      hoursToday: hoursToday,
      isTwentyFourHourClock: isTwentyFourHourClock,
      locale: locale
    });
  }
}
