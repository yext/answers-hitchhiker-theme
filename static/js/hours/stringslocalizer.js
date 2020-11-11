import provideOpenStatusTranslation from '../open-status-18n';
import provideTableHeadersTranslation from './table/table-strings-i18n';

/**
 * HoursStringsLocalizer is responsible for returning localized hours strings for
 * the current locale
 */
export default class HoursStringsLocalizer {
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
    this._translationData = {
      ...provideOpenStatusTranslation(locale),
      ...provideTableHeadersTranslation(locale)
    }
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
   * Returns a string for the given time, formatted for the current locale
   *
   * @param {number} yextTime A time between 0 and 2359 in 24-hour format
   * @returns {string}
   */
  getLocalizedTime(yextTime) {
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