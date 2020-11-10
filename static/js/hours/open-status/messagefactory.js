import HoursStringsLocalizer from '../stringslocalizer.js';
import { OpenStatusStrings, OpenStatusTypes } from './constants.js';
import { DayNames } from '../constants.js';

/**
 * Responsible for forming a localized open status message based on the hours data
 * and locale information provided.
 */
export default class OpenStatusMessageFactory {
  constructor(localizer) {
    /**
     * @type {HoursStringsLocalizer}
     */
    this._localizer = localizer;
  }

  /**
   * Creates a localized hours message
   *
   * @param {Object} hoursToday
   * @returns {string}
   */
  create(hoursToday) {
    let time, day;
    switch (hoursToday.status) {
      case OpenStatusTypes.OPEN_24_HOURS:
        return `
              <span class="Hours-statusText">
                ${this._localizer.getTranslation(OpenStatusStrings.OPEN_24_HOURS)}
              </span>`;
      case OpenStatusTypes.OPENS_TODAY:
        time = this._localizer.getLocalizedTime(hoursToday.nextTime);
        return `
              <span class="Hours-statusText">
                <span class="Hours-statusText--current">
                  ${this._localizer.getTranslation(OpenStatusStrings.CLOSED)}
                </span> · ${OpenStatusStrings.OPENS_AT} <span class="HoursInterval-time">
                  ${time}
                </span>
              </span>`;
      case OpenStatusTypes.OPENS_NEXT:
        time = this._localizer.getLocalizedTime(hoursToday.nextTime);
        day = this._localizer.getTranslation(hoursToday.nextDay);
        return `
              <span class="Hours-statusText">
                <span class="Hours-statusText--current">
                ${this._localizer.getTranslation(OpenStatusStrings.CLOSED)}
                </span> · ${this._localizer.getTranslation(OpenStatusStrings.OPENS_AT)}
              </span>
              <span class="HoursInterval-time">
                ${time}
              </span>
              <span class="HoursInterval-day">
                ${day}
              </span>`;
      case OpenStatusTypes.CLOSES_TODAY:
        time = this._localizer.getLocalizedTime(hoursToday.nextTime);
        return `
              <span class="Hours-statusText">
                <span class="Hours-statusText--current">
                  ${this._localizer.getTranslation(OpenStatusStrings.OPEN_NOW)}
                </span> · ${this._localizer.getTranslation(OpenStatusStrings.CLOSES_AT)}
              </span>
              <span class="HoursInterval-time">
                ${time}
              </span>`;
      case OpenStatusTypes.CLOSES_NEXT:
        time = this._localizer.getLocalizedTime(hoursToday.nextTime);
        day = this._localizer.getTranslation(hoursToday.nextDay);
        return `
              <span class="Hours-statusText">
                <span class="Hours-statusText--current">
                ${this._localizer.getTranslation(OpenStatusStrings.OPEN_NOW)}
                </span> · ${this._localizer.getTranslation(OpenStatusStrings.CLOSES_AT)}
              </span>
              <span class="HoursInterval-time">
                ${time}
              </span>
              <span class="HoursInterval-day">
                ${day}
              </span>`;
      case OpenStatusTypes.CLOSED:
        return `
              <span class="Hours-statusText">
                ${this._localizer.getTranslation(OpenStatusStrings.CLOSED)}
              </span>`;
      default:
        return '';
    }
  }
}