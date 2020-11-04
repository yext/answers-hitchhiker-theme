import provideOpenStatusTranslation from '../open-status-18n';
import clonedeep from 'lodash.clonedeep';

export default class HoursFormatter {
  /**
   * Returns a string, a formatted representation of the open hours status
   * for the given profile.
   * @param {Object} hoursField The profile field that contains the hours data
   * @param {String} timeZoneUtcOffset e.g. in EDT, GMT-0400, this value would be "-04:00"
   * @param {boolean} isTwentyFourHourClock Use 24 hour clock if true, 12 hour clock
   *                  if false. Default based on locale if undefined.
   * @param {String} locale The locale for the time string
   */
  getOpenStatus({ hoursField, timeZoneUtcOffset, isTwentyFourHourClock, locale }) {
    const days = this._formatHoursForAnswers(hoursField, timeZoneUtcOffset);
    if (days.length === 0) {
      return '';
    }

    const { time, day } = this._calculateYextDayTime(new Date(), timeZoneUtcOffset);

    /**
     * @type {{days: Object[], time: number, day: string, dayIndex: number }}
     */
    let hours = {
      days: days,
      time: time,
      day: day,
      dayIndex: this._dayToInt(day),
    };

    hours.yextDays = this._prepareIntervals(hours);
    let { status, nextTime, nextDay } = this._getStatus(hours);
    hours.nextTime = nextTime;
    hours.nextDay = nextDay;
    hours.status = status;

    return this._getTodaysMessage({ hoursToday: hours, isTwentyFourHourClock, locale: locale });
  }

  _prepareIntervals({ days }) { //days is a parsed json of hours.days
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
  _getNextInterval(yextDays, tomorrow) {
    for (let i = 0; i < 7; i++) {
      let index = (tomorrow + i) % 7;
      for (let interval of yextDays[index].intervals) {
        return { status: "OPENSNEXT", nextTime: interval.start, nextDay: this._intToDay(index) };
      }
    }
  }

  //the idea is to get the YextDay objects for yesterday and today. we ask yesterday
  //if it has an interval that overlaps into today (5pm - 3am) using _isOpenYesterday.
  //we then ask today if it has an interval that is open at the current time using isOpen.
  //is isOpenYesterday(yesterday) is true, then we return CLOSESTODAY with the interval overlapping from yesterday.
  //if today.isOpen is true, we check if it is 24 hours, if not we return CLOSESTODAY at the interval returned from isOpen.
  //else the store is closed and either opens sometime later today or at the next open interval sometime later in the week
  _getStatus({ time, day, yextDays }) {
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
      return { status: "CLOSESTODAY", nextTime: yesterdayIsOpen.interval.end, dayWithHours: yextDays[yesterday] };
    } else if (todayIsOpen.isOpen) {
      //check if open now
      if (this._is24Hours(yextDays[today].intervals).is24) {
        return { status: "OPEN24", dayWithHours: yextDays[today] };
      }
      //if not 24 hours, closes later today at the current intervals end time
      return { status: "CLOSESTODAY", nextTime: todayIsOpen.interval.end, dayWithHours: yextDays[today] };
    } else if (hasOpenIntervalToday.hasOpen) {
      //check if closed and has an interval later today
      return { status: "OPENSTODAY", nextTime: hasOpenIntervalToday.interval.start, dayWithHours: yextDays[today] };
    } else {
      //check if closed, get next available interval. if no intervals available return closed status without nextTime or nextDay
      let nextInfo = this._getNextInterval(yextDays, today + 1);
      if (nextInfo) {
        nextInfo.dayWithHours = yextDays[today];
      }
      return nextInfo || { status: "CLOSED", dayWithHours: yextDays[today] };
    }
  }

  //check if today has a 24 hr interval
  _is24Hours(intervals) {
    for (let interval of intervals) {
      if (interval.start == 0 && interval.end == 2359) {
        return { is24: true, interval };
      }
    }
    return { is24: false };
  }

  //given current time, check status with context: today
  //return boolean with open status and current interval
  _isOpen(intervals, time) {
    for (let interval of intervals) {
      if ((interval.start <= time && time < interval.end) || (interval.start <= time && interval.end <= interval.start) || (interval.start == 0 && interval.end == 2359)) {
        return { isOpen: true, interval };
      }
    }
    return { isOpen: false };
  }

  //given time, check if there is an interval today that the location opens
  _hasOpenIntervalToday(intervals, time) {
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
  _isOpenYesterday(intervals, time) {
    for (let interval of intervals) {
      if (time < interval.end && interval.end <= interval.start) {
        return { isOpen: true, interval };
      }
    }
    return { isOpen: false };
  }

  _dayToInt(d) {
    switch (d) {
      case "SUNDAY": return 0;
      case "MONDAY": return 1;
      case "TUESDAY": return 2;
      case "WEDNESDAY": return 3;
      case "THURSDAY": return 4;
      case "FRIDAY": return 5;
      case "SATURDAY": return 6;
    }
    throw "[_dayToInt]: Invalid Day: " + d;
  }

  _intToDay(i) {
    switch (i % 7) {
      case 0: return "SUNDAY";
      case 1: return "MONDAY";
      case 2: return "TUESDAY";
      case 3: return "WEDNESDAY";
      case 4: return "THURSDAY";
      case 5: return "FRIDAY";
      case 6: return "SATURDAY";
    }
  }

  /**
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
   * @param {string} timezone e.g. "-04:00"
   * @returns {Object[]}
   */
  _formatHoursForAnswers(days, timezone) {
    const formattedDays = clonedeep(days);
    const daysOfWeek = [
      'SUNDAY',
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY',
    ];
    const holidayHours = formattedDays.holidayHours || [];
    for (let day in formattedDays) {
      if (day === 'holidayHours' || day === 'reopenDate') {
        delete formattedDays[day];
      } else {
        const currentDayName = day.toUpperCase();
        const numberTimezone = this._convertTimezoneToNumber(timezone);
        const userDateToEntityDate = this._getDateWithUTCOffset(numberTimezone);
        const dayNameToDate = this._getNextDayOfWeek(userDateToEntityDate, daysOfWeek.indexOf(currentDayName));

        for (let holiday of holidayHours) {
          let holidayDate = new Date(holiday.date + 'T00:00:00.000');
          if (dayNameToDate.toDateString() == holidayDate.toDateString()) {
            holiday.intervals = this._formatIntervals(holiday.openIntervals);
            formattedDays[day].dailyHolidayHours = holiday;
          }
        }

        formattedDays[day].day = day.toUpperCase();

        let intervals = formattedDays[day].openIntervals;
        if (intervals) {
          for (let interval of intervals) {
            for (let period in interval) {
              interval[period] = parseInt(interval[period].replace(':', ''));
            }
          }
        } else {
          formattedDays[day].openIntervals = [];
        }
        formattedDays[day].intervals = formattedDays[day].openIntervals;
      }
    }

    return Object.values(formattedDays);
  }

  // "-05:00 -> -5
  _convertTimezoneToNumber(timezone) {
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

  _getDateWithUTCOffset(inputTzOffset) {
    var now = new Date(); // get the current time

    var currentTzOffset = -now.getTimezoneOffset() / 60 // in hours, i.e. -4 in NY
    var deltaTzOffset = inputTzOffset - currentTzOffset; // timezone diff

    var nowTimestamp = now.getTime(); // get the number of milliseconds since unix epoch
    var deltaTzOffsetMilli = deltaTzOffset * 1000 * 60 * 60; // convert hours to milliseconds (tzOffsetMilli*1000*60*60)
    var outputDate = new Date(nowTimestamp + deltaTzOffsetMilli) // your new Date object with the timezone offset applied.

    return outputDate;
  }

  _getNextDayOfWeek(date, dayOfWeek) {
    const resultDate = new Date(date.getTime());
    resultDate.setDate(date.getDate() + (7 + dayOfWeek - date.getDay()) % 7);
    return resultDate;
  }

  /**
   * Returns the hours intervals array with hours parsed into a number
   * e.g. "09:00" turning into 900.
   * @param {Object[]} intervals
   * @param {string} intervals[].start start time like "09:00"
   * @param {string} intervals[].end end time like "17:00"
   * @returns {Object[]}
   */
  _formatIntervals(intervals) {
    if (!intervals) {
      return [];
    }
    let formatted = Array.from(intervals);
    for (let interval of formatted) {
      for (let period in interval) {
        interval[period] = parseInt(interval[period].replace(':', ''));
      }
    }
    return formatted;
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
   * @param {string} timezoneUtcOffset e.g. in EDT, GMT-0400, this value would be "-04:00"
   * @returns {{ time: number, day: string }}
   */
  _calculateYextDayTime(now, timezoneUtcOffset) {
    // Get the UTC offset of the clients timezone (minutes converted to millis)
    const localUtcOffset = now.getTimezoneOffset() * 60 * 1000;

    // Get the entity's offset in millis
    const entityUtcOffsetInHours = this._convertTimezoneToNumber(timezoneUtcOffset);
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
  _getYextTime(date) {
    return date.getHours() * 100 + date.getMinutes();
  }

  _getYextDay(date) {
    switch (date.getDay() % 7) {
      case 0: return "SUNDAY";
      case 1: return "MONDAY";
      case 2: return "TUESDAY";
      case 3: return "WEDNESDAY";
      case 4: return "THURSDAY";
      case 5: return "FRIDAY";
      case 6: return "SATURDAY";
    }
  }

  _translate(text, translationData) {
    if (!translationData.hasOwnProperty(text)) {
      console.error(`Could not translate "${text}".`);
      return text;
    }
    return translationData[text];
  }

  _getTodaysMessage({ hoursToday, isTwentyFourHourClock, locale }) {
    let time, day;
    const translationData = provideOpenStatusTranslation(locale);
    const translate = text => this._translate(text, translationData);
    switch (hoursToday.status) {
      case 'OPEN24':
        return `<span class="Hours-statusText">${translate('Open 24 Hours')}</span>`;
      case 'OPENSTODAY':
        time = this._getTimeString(hoursToday.nextTime, isTwentyFourHourClock, locale);
        return `
              <span class="Hours-statusText">
                <span class="Hours-statusText--current">
                  ${translate('Closed')}
                </span> · ${translate('Opens at')} <span class="HoursInterval-time">
                  ${time}
                </span>
              </span>`;
      case 'OPENSNEXT':
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
      case 'CLOSESTODAY':
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
      case 'CLOSESNEXT':
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
      case 'CLOSED':
        return `
              <span class="Hours-statusText">
                ${translate('Closed')}
              </span>`;
      default:
        return '';
    }
  }

  _getTimeString(yextTime, isTwentyFourHourClock, locale = 'en-US') {
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
