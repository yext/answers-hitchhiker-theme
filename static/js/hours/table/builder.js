import { OpenStatusStrings } from '../open-status/constants';
import OpenStatusMessageFactory from '../open-status/messagefactory';
import Hours from '../models/hours';
import HoursStringsLocalizer from '../stringslocalizer';
import { DayNames, TableHeaders } from '../constants';

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
   *   firstDayInList: {@link DayName}
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

    const sortedDays = hours.getSortedDaysStartingFrom(config.firstDayInList || hours.today.day);
    for (const day of sortedDays) {
      tableBodyHTML += this._buildTableRow(day, hours, config.disableOpenStatus);
    }

    return tableBodyHTML;
  }

  /**
   * Returns the markup for a table row (<tr>) for the specified day.
   *
   * @param {Object} day
   * @param {Hours} hours
   * @param {boolean} shouldDisableOpenStatus
   * @returns {string}
   */
  _buildTableRow(day, hours, shouldDisableOpenStatus) {
    const isCurrentDayOfWeek = day.day == hours.today.day;

    let classes = '';
    if (day.dailyHolidayHours) {
      classes += ' is-holiday';
    }

    if (isCurrentDayOfWeek) {
      classes += ' is-today';
    }

    const holidayHours = day.dailyHolidayHours || {};
    const hoursIntervals = !holidayHours.isRegularHours && holidayHours.intervals
      ? holidayHours.intervals
      : day.intervals;
    const shouldShowOpenStatusMessage = isCurrentDayOfWeek
      && !shouldDisableOpenStatus
      && hoursIntervals.length === 1;

    return `
      <tr class="c-hours-details-row${classes}">
        <td class="c-hours-details-row-day">
          ${this._localizer.getTranslation(day.day)}
        </td>
        <td class="c-hours-details-row-intervals">
          ${(shouldShowOpenStatusMessage
              ? this._buildOpenStatusHTML(hours.openStatus)
              : this._buildIntervalsForDay(hoursIntervals))}
        </td>
      </tr>`;
  }

  /**
   * Returns the markup for the open status
   *
   * @param {Object} openStatus
   */
  _buildOpenStatusHTML(openStatus) {
    return `
      <span class="c-hours-details-row-intervals-instance">
        <span class="c-hours-details-row-intervals-instance-open">
            ${new OpenStatusMessageFactory(this._localizer).create(openStatus)}
        </span>
      </span>`;
  }

  /**
   * Returns the markup for all hours intervals specified
   *
   * @param {Object[]} hoursIntervals
   * @returns {string}
   */
  _buildIntervalsForDay(hoursIntervals) {
    if (hoursIntervals.length === 0) {
      return this._localizer.getTranslation(OpenStatusStrings.CLOSED);
    }

    let intervalsHTML = '';
    for (const interval of hoursIntervals) {
      intervalsHTML += `
        <span class="c-hours-details-row-intervals-instance">
          ${this._getIntervalHTML(interval.start, interval.end)}
        </span>`;
    }
    return intervalsHTML;
  }

  /**
   * Returns the markup for an hours interval with the given start and end time.
   *
   * @param {number} startTime
   * @param {number} endTime
   * @returns {string}
   */
  _getIntervalHTML(startTime, endTime) {
    const isOpenAllDay = startTime == 0 && endTime == 2359;
    if (isOpenAllDay) {
      return this._localizer.getTranslation(OpenStatusStrings.OPEN_24_HOURS);
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
