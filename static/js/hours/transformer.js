import { DayNames } from './constants.js';
import Hours from './models/hours.js';
import { OpenStatusTypes } from './open-status/constants.js';

/**
 * Responsible for transforming the hours data into the format expected by our hours formatters
 */
export default class HoursTransformer {
  /**
   * Uses the UTC offset, current time, and hours data to determine if the user is within an
   * open interval, and when the current interval (open or closed) ends. Returns an
   * {@link Hours} object.
   *
   * @param {Object} hoursField
   * @param {string} timeZoneUtcOffset
   * @returns {Hours}
   */
  static transform(hoursField, timeZoneUtcOffset) {
    const days = this._formatHoursForAnswers(hoursField, timeZoneUtcOffset);
    if (days.length === 0) {
      return;
    }

    const { time, day } = this._calculateYextDayTime(new Date(), timeZoneUtcOffset);

    return new Hours({
      days: days,
      today: {
        time: time,
        day: day,
      },
      openStatus: this._getStatus(time, day, days)
    });
  }

  static _prepareIntervals(days) { //days is a parsed json of hours.days
    let results = [];
    for (const { intervals, day, dailyHolidayHours } of days) { //iterate through each day within days
      if (dailyHolidayHours) { //prioritize holiday hours over intervals
        results[this._dayToInt(day)] = {
          dayName: day,
          dayIndex: this._dayToInt(day),
          intervals: dailyHolidayHours.isRegularHours ? intervals : dailyHolidayHours.intervals,
        };
      } else {
        results[this._dayToInt(day)] = {
          dayName: day,
          dayIndex: this._dayToInt(day),
          intervals: intervals,
        };
      }
    }
    results = results.sort((a, b) => {
      return a.dayIndex - b.dayIndex || a.start - b.start; //sort by day then by time
    });

    return results;
  }

  //return the next valid interval in the week
  static _getNextInterval(yextDays, tomorrow) {
    for (let i = 0; i < 7; i++) {
      let index = (tomorrow + i) % 7;
      for (let interval of yextDays[index].intervals) {
        return { status: OpenStatusTypes.OPENS_NEXT, nextTime: interval.start, nextDay: this._intToDay(index) };
      }
    }
  }

  //the idea is to get the YextDay objects for yesterday and today. we ask yesterday
  //if it has an interval that overlaps into today (5pm - 3am) using _isOpenYesterday.
  //we then ask today if it has an interval that is open at the current time using isOpen.
  //is isOpenYesterday(yesterday) is true, then we return CLOSESTODAY with the interval overlapping from yesterday.
  //if today.isOpen is true, we check if it is 24 hours, if not we return CLOSESTODAY at the interval returned from isOpen.
  //else the store is closed and either opens sometime later today or at the next open interval sometime later in the week
  static _getStatus(time, day, days) {
    const yextDays = this._prepareIntervals(days);
    const negMod = (n, m) => ((n % m) + m) % m; // JavaScript doesnt support modulo on negative numbers
    let yesterday = this._dayToInt(day) - 1;
    yesterday = negMod(yesterday, 7);
    let today = this._dayToInt(day);
    let yesterdayIsOpen = this._isOpenYesterday(yextDays[yesterday].intervals, time);
    let todayIsOpen = this._isOpen(yextDays[today].intervals, time);
    let hasOpenIntervalToday = this._hasOpenIntervalToday(yextDays[today].intervals, time);

    if (yesterdayIsOpen.isOpen) {
      //check if any hours from yesterday are valid
      //dayWithHours is used to render the proper day on the hours table
      return { status: OpenStatusTypes.CLOSES_TODAY, nextTime: yesterdayIsOpen.interval.end, dayWithHours: yextDays[yesterday] };
    } else if (todayIsOpen.isOpen) {
      //check if open now
      if (this._is24Hours(yextDays[today].intervals).is24) {
        return { status: OpenStatusTypes.OPEN_24_HOURS, dayWithHours: yextDays[today] };
      }
      //if not 24 hours, closes later today at the current intervals end time
      return { status: OpenStatusTypes.CLOSES_TODAY, nextTime: todayIsOpen.interval.end, dayWithHours: yextDays[today] };
    } else if (hasOpenIntervalToday.hasOpen) {
      //check if closed and has an interval later today
      return { status: OpenStatusTypes.OPENS_TODAY, nextTime: hasOpenIntervalToday.interval.start, dayWithHours: yextDays[today] };
    } else {
      //check if closed, get next available interval. if no intervals available return closed status without nextTime or nextDay
      let nextInfo = this._getNextInterval(yextDays, today + 1);
      if (nextInfo) {
        nextInfo.dayWithHours = yextDays[today];
      }
      return nextInfo || { status: OpenStatusTypes.CLOSED, dayWithHours: yextDays[today] };
    }
  }

  //check if today has a 24 hr interval
  static _is24Hours(intervals) {
    for (let interval of intervals) {
      if (interval.start == 0 && interval.end == 2359) {
        return { is24: true, interval };
      }
    }
    return { is24: false };
  }

  //given current time, check status with context: today
  //return boolean with open status and current interval
  static _isOpen(intervals, time) {
    for (let interval of intervals) {
      if ((interval.start <= time && time < interval.end) || (interval.start <= time && interval.end <= interval.start) || (interval.start == 0 && interval.end == 2359)) {
        return { isOpen: true, interval };
      }
    }
    return { isOpen: false };
  }

  //given time, check if there is an interval today that the location opens
  static _hasOpenIntervalToday(intervals, time) {
    for (let interval of intervals) {
      if (time < interval.start) {
        return { hasOpen: true, interval };
      }
    }
    return { hasOpen: false };
  }

  //given current time, check status with context: yesterday
  //for example: if today is Tuesday and it is 2am and Monday had an interval open from 12pm-3am, Monday.isOpenYesterday will return true
  //return boolean with open status and current interval
  static _isOpenYesterday(intervals, time) {
    for (let interval of intervals) {
      if (time < interval.end && interval.end <= interval.start) {
        return { isOpen: true, interval };
      }
    }
    return { isOpen: false };
  }

  static _dayToInt(d) {
    switch (d) {
      case DayNames.SUNDAY: return 0;
      case DayNames.MONDAY: return 1;
      case DayNames.TUESDAY: return 2;
      case DayNames.WEDNESDAY: return 3;
      case DayNames.THURSDAY: return 4;
      case DayNames.FRIDAY: return 5;
      case DayNames.SATURDAY: return 6;
    }
    throw "[_dayToInt]: Invalid Day: " + d;
  }

  static _intToDay(i) {
    switch (i % 7) {
      case 0: return DayNames.SUNDAY;
      case 1: return DayNames.MONDAY;
      case 2: return DayNames.TUESDAY;
      case 3: return DayNames.WEDNESDAY;
      case 4: return DayNames.THURSDAY;
      case 5: return DayNames.FRIDAY;
      case 6: return DayNames.SATURDAY;
    }
  }

  /**
   * Transforms the hours data into the shape needed by the front-end
   *
   * @param {Object} days e.g.
   * {
   *   monday: {
   *     isClosed: false,
   *     openIntervals: [{ start: '01:00', end: '02:00' }]
   *   },
   *   holidayHours: [
   *     { date: '2020-7-28', openIntervals: [{ start: '01:00', end: '02:00' }] },
   *     { date: '2020-7-29', isClosed: true },
   *     { date: '2020-7-30', isRegularHours: true }
   *   ]
   * }
   * @param {string} timezone
   * @returns {Object[]}
   */
  static _formatHoursForAnswers(days, timezone) {
    const daysOfWeek = Object.values(DayNames);
    return Object.entries(days)
      .filter(([day]) => day !== 'holidayHours' && day !== 'reopenDate')
      .reduce((formattedDays, [day, dayInfo]) => {
        const currentDayName = day.toUpperCase();
        const numberTimezone = this._convertTimezoneToNumber(timezone);
        const userDate = this._getDateWithUTCOffset(numberTimezone);
        const nextDayOfWeek = this._getNextDayOfWeek(userDate, daysOfWeek.indexOf(currentDayName));
        const dailyHolidayHours = this._getDailyHolidayHours(days.holidayHours, nextDayOfWeek);
        const openIntervals = (dayInfo.openIntervals || []).map(this._formatInterval);

        const formattedDay = {
          day: currentDayName,
          ...dailyHolidayHours && { dailyHolidayHours },
          openIntervals: openIntervals,
          intervals: openIntervals,
          isClosed: dayInfo.isClosed
        }

        formattedDays.push(formattedDay);
        return formattedDays;
      }, []);
  }

  /**
   * Converts the timezoneUtcOffset to a number. For example: "-05:00 -> -5
   *
   * @param {string} timezoneUtcOffset e.g. in EDT, GMT-0400, this value would be "-04:00"
   * @returns {number}
   */
  static _convertTimezoneToNumber(timezone) {
    if (!timezone) {
      return 0;
    }
    let num = 0;
    let tzs = timezone.split(':');
    if (tzs.length < 2) {
      return 0;
    }
    num += parseInt(tzs[0]);
    num += parseInt(tzs[1]) / 60;
    return num;
  }

  static _getDateWithUTCOffset(inputTzOffset) {
    var now = new Date(); // get the current time

    var currentTzOffset = -now.getTimezoneOffset() / 60 // in hours, i.e. -4 in NY
    var deltaTzOffset = inputTzOffset - currentTzOffset; // timezone diff

    var nowTimestamp = now.getTime(); // get the number of milliseconds since unix epoch
    var deltaTzOffsetMilli = deltaTzOffset * 1000 * 60 * 60; // convert hours to milliseconds (tzOffsetMilli*1000*60*60)
    var outputDate = new Date(nowTimestamp + deltaTzOffsetMilli) // your new Date object with the timezone offset applied.

    return outputDate;
  }

  static _getNextDayOfWeek(date, dayOfWeek) {
    const resultDate = new Date(date.getTime());
    resultDate.setDate(date.getDate() + (7 + dayOfWeek - date.getDay()) % 7);
    return resultDate;
  }

  /**
   * @typedef HolidayHourInfo
   * @type {Object}
   * @property {string} date the date of the holiday
   * @property {boolean} isClosed indicates whether or not the location is closed
   * @property {boolean} isRegularHours indicates whether or not the location has regular hours on the holiday
   * @property {OpenInterval[]} openIntervals intervals of time when the location is open
   */

  /**
   * @typedef OpenInterval
   * @type {Object}
   * @property {string} start start time, e.g. '03:00'
   * @property {string} end end time, e.g '09:00'
   */

  /**
   * Gets the holiday hours for the provided date given a HoldiayHourInfo list
   * @param {HolidayHourInfo[]} holidayHours
   * @param {Date} date
   * @returns {Object|null}
   */
  static _getDailyHolidayHours (holidayHours = [], date) {
    const holidayHoursForDate = holidayHours.find(holiday => {
      const holidayDate = new Date(holiday.date + 'T00:00:00.000');
      return date.toDateString() == holidayDate.toDateString();
    });

    if (!holidayHoursForDate) {
      return null;
    }

    const formattedIntervals = (holidayHoursForDate.openIntervals || []).map(this._formatInterval);

    return {
      date: holidayHoursForDate.date,
      intervals: formattedIntervals,
      openIntervals: formattedIntervals,
      ...holidayHoursForDate.isClosed && { isClosed: true },
      ...holidayHoursForDate.isRegularHours && { isRegularHours: true }
    };
  }

  /**
   * @typedef NumericOpenInterval
   * @type {Object}
   * @property {number} start start time, e.g. '300'
   * @property {number} end end time, e.g '900'
   */

  /**
   * Returns the hours intervals object with hours parsed into a number
   * e.g. "09:00" turning into 900.
   * @param {OpenInterval} interval
   * @returns {NumericOpenInterval}
   */
  static _formatInterval (interval) {
    return Object.entries(interval).reduce((formattedInterval, [period, value]) => {
      formattedInterval[period] = parseInt(value.replace(':', ''));
      return formattedInterval;
    }, {});
  }

  /**
   * Calculates a yext time and date using utc offset
   * If no valid utc offset is provided, time and date will
   * be based off of clients local time.
   *
   * Example
   *
   * Users local time in EDT (now): Fri Jun 21 2019 14:21:10 GMT-0400
   * Their localUtcOffset will be +4 hours (for user offset, +/- is flipped)
   *
   * They are viewing a store in germany, CEST/GMT+2
   * For this date, the timezoneUtcOffset will be +2 hours (for entity offset, +/- is normal)
   *
   * Adding this together:
   * now + utcOffset + localUtcOffset -> now + 2 hours + 4 hours
   * now = Fri Jun 21 2019 20:21:10 GMT-0400
   *
   * This is technically incorrect, as users local time is not 8PM EDT,
   * its 2PM EDT/8PM CEST, but because our components do not consider
   * timezones at all, this converted date will allow the entity
   * pages to display as if the user was in the same timezone as the entity.
   *
   * @param {Date} now
   * @param {string} timeZoneUtcOffset
   * @returns {{ time: number, day: string }}
   */
  static _calculateYextDayTime(now, timeZoneUtcOffset) {
    // Get the UTC offset of the clients timezone (minutes converted to millis)
    const localUtcOffset = now.getTimezoneOffset() * 60 * 1000;

    // Get the entity's offset in millis
    const entityUtcOffsetInHours = this._convertTimezoneToNumber(timeZoneUtcOffset);
    const entityUtcOffsetMillis = entityUtcOffsetInHours * 60 * 60 * 1000;

    // If a valid offset was found, set the today value to a new date that accounts for the entity & local UTC offsets
    if (entityUtcOffsetMillis !== 0) {
      now = new Date(now.valueOf() + entityUtcOffsetMillis + localUtcOffset);
    }
    const time = this._getYextTime(now);
    const day = this._getYextDay(now);

    return { time, day };
  }

  /**
   * @param {Date} date
   * @returns {number} a number like 1425, which represents 02:25 PM
   */
  static _getYextTime(date) {
    return date.getHours() * 100 + date.getMinutes();
  }

  static _getYextDay(date) {
    switch (date.getDay() % 7) {
      case 0: return DayNames.SUNDAY;
      case 1: return DayNames.MONDAY;
      case 2: return DayNames.TUESDAY;
      case 3: return DayNames.WEDNESDAY;
      case 4: return DayNames.THURSDAY;
      case 5: return DayNames.FRIDAY;
      case 6: return DayNames.SATURDAY;
    }
  }
}