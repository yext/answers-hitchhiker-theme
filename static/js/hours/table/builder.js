import { OpenStatusStrings } from '../open-status/constants';
import OpenStatusMessageFactory from '../open-status/messagefactory';
import HoursStringsLocalizer from '../stringslocalizer';
import { TableHeaders } from '../constants';

export default class HoursTableBuilder {
  constructor(localizer) {
    /**
     * @type {HoursStringsLocalizer}
     */
    this._localizer = localizer;
  }

  /**
   * Builds the HTML for the hours table.
   *
   * @param {Hours} hours
   * @param {Object} config
   * {
   *   disableOpenStatus: boolean
   *   showTodayFirst: boolean
   * }
   * @returns {string}
   */
  build(hours, config = {}) {
    return `
      <div class="c-hours-details-wrapper js-hours-table">
        <table class="c-hours-details">
          <thead class="sr-only">
            <tr>
              <th scope="col">${this._localizer.getTranslation(TableHeaders.DAY_OF_WEEK)}</th>
              <th scope="col">${this._localizer.getTranslation(TableHeaders.HOURS)}</th>
            </tr>
          </thead>
          <tbody>
            ${this._buildTableBodyContent(hours, config)}
          </tbody>
        </table>
      </div>`;
  }

  /**
   * Returns the content for the body of the hours table
   *
   * @param {Hours} hours
   * @param {Object} config
   * @returns {string}
   */
  _buildTableBodyContent(hours, config) {
    let tableBodyHTML = '';

    // Iterate through days in order, either starting at Monday or today
    const startingDayIndex = config.showTodayFirst
      ? (hours.today.dayNumber > 0 ? (hours.today.dayNumber - 1) : 6)
      : 0;
    for (let i = startingDayIndex; i < hours.days.length; i++) {
      tableBodyHTML += this._buildTableRow(hours.days[i], hours, config);
    }
    for (let i = 0; i < startingDayIndex; i++) {
      tableBodyHTML += this._buildTableRow(hours.days[i], hours, config);
    }

    return tableBodyHTML;
  }

  /**
   * Returns the markup for a table row (<tr>) for the specified day.
   *
   * @param {Object} day
   * @param {Hours} hours
   * @param {Object} config
   * @returns {string}
   */
  _buildTableRow(day, hours, config) {
    const isCurrentDayOfWeek = day.day == hours.today.day;

    let classes = '';
    if (day.dailyHolidayHours) {
      classes += ' is-holiday';
    }

    if (isCurrentDayOfWeek) {
      classes += ' is-today';
    }

    const hoursIntervals = day.dailyHolidayHours && day.dailyHolidayHours.isRegularHours
      ? day.intervals || []
      : ((day.dailyHolidayHours && day.dailyHolidayHours.intervals) || day.intervals || []);
    const openStatusMessage = isCurrentDayOfWeek && !config.disableOpenStatus &&
      new OpenStatusMessageFactory(this._localizer).create(hours.openStatus);
    return `
      <tr class="c-hours-details-row${classes}">
        <td class="c-hours-details-row-day">
            ${this._localizer.getTranslation(day.day)}
        </td>
        <td class="c-hours-details-row-intervals">
          ${(hoursIntervals.length == 0
              ? this._localizer.getTranslation(OpenStatusStrings.CLOSED)
              : this._buildIntervalsForDay(hoursIntervals, openStatusMessage))}
        </td>
      </tr>`;
  }

  /**
   * Returns the markup for all hours intervals specified
   *
   * @param {Object[]} hoursIntervals
   * @param {string} openStatusMessage
   * @returns {string}
   */
  _buildIntervalsForDay(hoursIntervals, openStatusMessage) {
    let intervalsHTML = '';
    for (const interval of hoursIntervals) {
      intervalsHTML += `
        <span class="c-hours-details-row-intervals-instance">
          ${this._getIntervalHTML(
            interval.start, interval.end, (hoursIntervals.length === 1 && openStatusMessage))}
        </span>`;
    }
    return intervalsHTML;
  }

  /**
   * Returns the markup for an hours interval with the given start and end time. Prefers
   * an openStatusMessage, if provided.
   *
   * @param {number} startTime
   * @param {number} endTime
   * @param {string} openStatusMessage
   * @returns {string}
   */
  _getIntervalHTML(startTime, endTime, openStatusMessage) {
    const isOpenAllDay = startTime == 0 && endTime == 2359;
    if (isOpenAllDay) {
      return this._localizer.getTranslation(OpenStatusStrings.OPEN_24_HOURS);
    }

    if (openStatusMessage) {
      return `
        <span class="c-hours-details-row-intervals-instance-open">
          ${openStatusMessage}
        </span>`;
    }

    return `
      <span class="c-hours-details-row-intervals-instance-open">
        ${this._localizer.getLocalizedTime(startTime)}
      </span>
      <span class="c-hours-details-row-intervals-instance-separator" aria-label="To">
        -
      </span>
      <span class="c-hours-details-row-intervals-instance-close">
        ${this._localizer.getLocalizedTime(endTime)}
      </span>`;
  }
}
