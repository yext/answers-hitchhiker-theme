import provideOpenStatusTranslation from '../open-status-18n';

/**
 * HoursLocalizer is responsible for returning localized hours strings for the current locale
 */
export default class HoursLocalizer {
  constructor(locale, isTwentyFourHourClock) {
    /**
     * @type {string}
     */
    this._locale = locale || 'en-US';

    /**
     * @type {boolean}
     */
    this._isTwentyFourHourClock = isTwentyFourHourClock;

    /**
     * @type {Object<string, string>} translationData
     */
    this._translationData = provideOpenStatusTranslation(locale);
  }

  /**
   * Returns the translated value for the text. If there is no
   * translation found in the translatedData, prints an error
   * message to the console and returns the original text provided.
   *
   * @param {string} text
   * @returns {string}
   */
  getTranslation(text) {
    if (!this._translationData.hasOwnProperty(text)) {
      console.error(`Could not translate "${text}".`);
      return text;
    }
    return this._translationData[text];
  }

  /**
   * Returns a localized string for the given time
   *
   * @param {number} yextTime A number in 24-hour time describing a time
   * @returns {string}
   */
  getTimeString(yextTime) {
    let time = new Date();
    time.setHours(Math.floor(yextTime / 100));
    time.setMinutes(yextTime % 100);

    return time.toLocaleString(this.locale, {
      hour: 'numeric',
      minute: 'numeric',
      ...this._isTwentyFourHourClock && { hourCycle: this._isTwentyFourHourClock ? 'h24' : 'h12' }
    });
  }
}