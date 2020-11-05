import provideOpenStatusTranslation from '../../open-status-18n.js';
import { OpenStatusTypes } from './constants.js';

/**
 * Responsible for forming a localized open status message based on the hours data
 * and locale information provided.
 */
export default class OpenStatusMessageFactory {
  /**
   * Creates a localized hours message
   *
   * @param {Object} hoursToday
   * @param {boolean} isTwentyFourHourClock
   * @param {string} locale
   * @returns {string}
   */
  static create({ hoursToday, isTwentyFourHourClock, locale }) {
    let time, day;
    const translationData = provideOpenStatusTranslation(locale);
    const translate = text => this._translate(text, translationData);
    switch (hoursToday.status) {
      case OpenStatusTypes.OPEN_24_HOURS:
        return `<span class="Hours-statusText">${translate('Open 24 Hours')}</span>`;
      case OpenStatusTypes.OPENS_TODAY:
        time = this._getTimeString(hoursToday.nextTime, isTwentyFourHourClock, locale);
        return `
              <span class="Hours-statusText">
                <span class="Hours-statusText--current">
                  ${translate('Closed')}
                </span> · ${translate('Opens at')} <span class="HoursInterval-time">
                  ${time}
                </span>
              </span>`;
      case OpenStatusTypes.OPENS_NEXT:
        time = this._getTimeString(hoursToday.nextTime, isTwentyFourHourClock, locale);
        day = translate(hoursToday.nextDay);
        return `
              <span class="Hours-statusText">
                <span class="Hours-statusText--current">
                  ${translate('Closed')}
                </span> · ${translate('Opens at')}
              </span>
              <span class="HoursInterval-time">
                ${time}
              </span>
              <span class="HoursInterval-day">
                ${day}
              </span>`;
      case OpenStatusTypes.CLOSES_TODAY:
        time = this._getTimeString(hoursToday.nextTime, isTwentyFourHourClock, locale);
        return `
              <span class="Hours-statusText">
                <span class="Hours-statusText--current">
                  ${translate('Open Now')}
                </span> · ${translate('Closes at')}
              </span>
              <span class="HoursInterval-time">
                ${time}
              </span>`;
      case OpenStatusTypes.CLOSES_NEXT:
        time = this._getTimeString(hoursToday.nextTime, isTwentyFourHourClock, locale);
        day = translate(hoursToday.nextDay);
        return `
              <span class="Hours-statusText">
                <span class="Hours-statusText--current">
                  ${translate('Open Now')}
                </span> · ${translate('Closes at')}
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
                ${translate('Closed')}
              </span>`;
      default:
        return '';
    }
  }

  /**
   * Returns the translated value for the text. If there is no
   * translation found in the translatedData, prints an error
   * message to the console and returns the original text provided.
   *
   * @param {string} text
   * @param {Object<string, string>} translationData
   */
  static _translate(text, translationData) {
    if (!translationData.hasOwnProperty(text)) {
      console.error(`Could not translate "${text}".`);
      return text;
    }
    return translationData[text];
  }

  /**
   * Returns a localized string for the given time
   *
   * @param {string} yextTime
   * @param {boolean} isTwentyFourHourClock
   * @param {string} locale
   * @returns {string}
   */
  static _getTimeString(yextTime, isTwentyFourHourClock, locale = 'en-US') {
    let time = new Date();
    time.setHours(Math.floor(yextTime / 100));
    time.setMinutes(yextTime % 100);

    return time.toLocaleString(locale, {
      hour: 'numeric',
      minute: 'numeric',
      ...isTwentyFourHourClock && { hourCycle: isTwentyFourHourClock ? 'h24' : 'h12' }
    });
  }
}