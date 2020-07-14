import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { components__address__i18n__addressForCountry } from './address-i18n.js'
import CtaFormatter from '@yext/cta-formatter';

/**
 * Contains some of the commonly used formatters for parsing pieces
 * of profile information.
 */
export default class Formatters {
    static address(profile) {
      if (!profile.address) {
        return '';
      }
      return components__address__i18n__addressForCountry({
        profile: profile,
        derivedData: {address: {stateName: ''}},
        regionAbbr: true,
      });
    }

    static phoneLink(profile, key = 'mainPhone') {
        if (!profile[key]) {
            return '';
        }
        return `tel:${profile[key]}`;
    }

    static phoneDisplay(profile, key = 'mainPhone') {
        if (!profile[key]) {
            return '';
        }
        return `${profile[key]}`;
    }

    static nationalizedPhoneDisplay(profile, key = 'mainPhone') {
      if (!profile[key]) {
          return '';
      }
      const phoneNumber = parsePhoneNumberFromString(profile[key])
      return phoneNumber ? phoneNumber.formatNational() : '';
    }

    static emailLink(profile) {
        return profile.emails ? "mailto:" + profile.emails[0] : ''
    }

    static getDirectionsUrl(profile, key = 'address') {
        const addr = profile[key];
        if (!addr) {
          return '';
        }

        const line2 = addr.line2 ? ` ${addr.line2},` : ``;
        const region = addr.region ? ` ${addr.region}` : ``;
        const rawQuery = `${addr.line1},${line2} ${addr.city},${region} ${addr.postalCode} ${addr.countryCode}`;
        const query = encodeURIComponent(rawQuery);
        return `https://www.google.com/maps/search/?api=1&query=${query}&output=classic`
    }

  static toKilometers(profile, key = 'd_distance', displayUnits = 'km') {
    if (!profile[key]) {
      return '';
    }
    const distanceInKilometers = profile[key] / 1000; // Convert meters to kilometers
    return distanceInKilometers.toFixed(1) + ' ' + displayUnits;
  }

  static toMiles(profile, key = 'd_distance', displayUnits = 'mi') {
    if (!profile[key]) {
      return '';
    }
    const distanceInMiles = profile[key] / 1609.344; // Convert meters to miles
    return distanceInMiles.toFixed(1) + ' ' + displayUnits;
  }

  static isTodayHoliday(holidayItem, todayDate) {
    if (!holidayItem.date) {
      return false;
    }

    const holidayDate = holidayItem.date.split('-');

    return parseInt(holidayDate[0]) === todayDate.getFullYear() &&
      parseInt(holidayDate[1]) === todayDate.getMonth() + 1 &&
      parseInt(holidayDate[2]) === todayDate.getDate()
  }

  static _getProfileFieldAtKeyPath(profile, keypath) {
    const paths = keypath.split('.');

    if (!paths.length) {
      console.error('invalid key path', keypath);
      return null;
    }

    return paths.reduce((haystack, needleKey) => {
      if (!haystack) {
        console.log('haystack was null or undefined', haystack, needleKey, idx);
        return null;
      }
      const needle = haystack[needleKey];
      if (!needle) {
        console.log('could not find ' + needleKey, haystack);
        return null;
      }

      return needle;
    }, profile);
  }

  static bigDate(profile, keyPath = 'time.start') {
    const dateString = this._getProfileFieldAtKeyPath(profile, keyPath);
    if (!dateString) {
      return null;
    }

    const date = this.betterTime(dateString);
    const locale = document.documentElement.lang.replace('_', '-');
    const time = date.toLocaleString(locale, {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });

    return {
      day: date.getDate(),
      month: date.toLocaleString(locale, { month: 'long' }),
      time: time,
    };
  }

  static betterTime(stamp) {
    const offset = new Date(stamp).getTimezoneOffset() / 60;
    const offsetStr = (offset < 0 ? '+0' : '-0') + Math.abs(offset) + ':00';
    return new Date(stamp + offsetStr);
  }

  static dateRange(
    profile,
    key = 'time',
    dateFormatOptions = {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    },
    separator = '-') {

    const dateField = profile[key];
    if (!dateField) {
      console.error('could not find ', key, profile);
      return null;
    }

    if (!(dateField.start || dateField.end)) {
      console.error(key, 'is empty', profile);
      return null;
    }

    const locale = document.documentElement.lang.replace('_', '-');
    const start = this.betterTime(dateField.start);
    const end = this.betterTime(dateField.end);
    const startString = start.toLocaleString(locale, dateFormatOptions);
    let endString = end.toLocaleString(locale, dateFormatOptions);

    if (startString && endString) {
      if (start.toLocaleDateString() === end.toLocaleDateString()) {
        endString = end.toLocaleString(locale, {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        });
      }

      return `${startString} ${separator} ${endString}`;
    }

    if (startString) {
      return startString;
    }

    return endString;
  }

  static snakeToTitle(snake) {
    return snake.split('_')
      .map(frag => `${frag.charAt(0).toUpperCase()}${frag.slice(1)}`)
      .join(' ');
  }

  static prettyPrintObject(obj) {
    switch (typeof obj) {
      case 'string':
      case 'number':
      case 'bigint':
        return obj.toLocaleString();
      case 'boolean':
        return obj ? 'Yes' : 'No';
      case 'object':
        // check for null
        if (!obj) {
          return '';
        }
        if (Array.isArray(obj)) {
          return obj.map(sub => this.prettyPrintObject(sub)).join('<br>');
        }
        return Object.entries(obj)
          .map(([_, val]) => this.prettyPrintObject(val)).join(', ');
      default:
        return '';
    }
  }

  static joinList(list, separator) {
    if (!list) {
      return '';
    }
    return list.join(separator);
  }

  /*
  * Given object with url and alternateText, changes url to use https
  */
  static image(simpleOrComplexImage = {}, size = '200x', atLeastAsLarge = true) {
    let img = simpleOrComplexImage.image || simpleOrComplexImage;
    if (!img) {
      return {};
    }

    if (!img.url) {
      return img;
    }

    function imageBySizeEntity(image, desiredSize, atLeastAsLarge = true) {
      if ((image == null) || !(Object.prototype.toString.call(image).indexOf('Object') > 0)) {
        throw new Error("Expected parameter of type Map");
      }
      if ((typeof desiredSize !== 'string') || (desiredSize == null)) {
        throw new Error(`Object of type string expected. Got ${typeof desiredSize}.`);
      }
      if (desiredSize.indexOf('x') === -1) {
        throw new Error("Invalid desired size");
      }
      if ((typeof atLeastAsLarge !== 'boolean') || (atLeastAsLarge == null)) {
        throw new Error(`Object of type boolean expected. Got ${typeof atLeastAsLarge}.`);
      }

      if (!image.thumbnails) {
        image.thumbnails = [];
      }

      if (!Array.isArray(image.thumbnails)) {
        throw new Error(`Object of type array expected. Got ${typeof image.thumbnails}.`);
      }

      if (image.width != undefined && image.height != undefined && image.url != undefined) {
        image.thumbnails.push({
          'width': image.width,
          'height': image.height,
          'url': image.url
        });
      }

      let height, index;
      let width = (height = -1);
      let desiredDims = desiredSize.split('x');

      if (desiredDims[0] !== '') {
        width = Number.parseInt(desiredDims[0]);
        if (Number.isNaN(width)) {
          throw new Error("Invalid width specified");
        }
      }

      if (desiredDims[1] !== '') {
        height = Number.parseInt(desiredDims[1]);
        if (Number.isNaN(height)) {
          throw new Error("Invalid height specified");
        }
      }

      let widthOk = width === -1;
      let heightOk = height === -1;

      if (atLeastAsLarge) {
        index = image.thumbnails.length - 1;

        while (index >= 0) {
          if (!(image.thumbnails[index].width && image.thumbnails[index].height)) {
            return image.thumbnails[index].url;
          }

          widthOk = width > 0 ? (image.thumbnails[index].width >= width) : widthOk;
          heightOk = height > 0 ? (image.thumbnails[index].height >= height) : heightOk;

          if (heightOk && widthOk) {
            break;
          }

          index--;
        }

        // if we exhausted the list
        if (index <= 0) {
          index = 0;
        }
      } else {
        index = 0;

        while (index < image.thumbnails.length) {
          if (!(image.thumbnails[index].width && image.thumbnails[index].height)) {
            return image.thumbnails[index].url;
          }

          if (width > 0) {
            widthOk = image.thumbnails[index].width <= width;
          }

          if (height > 0) {
            heightOk = image.thumbnails[index].height <= height;
          }

          if (heightOk && widthOk) { break; }

          index++;
        }

        // if we exhausted the list
        if (index >= image.thumbnails.length) {
          index = image.thumbnails.length - 1;
        }
      }

      return image.thumbnails[index].url;
    }

    const result = imageBySizeEntity(img, size, atLeastAsLarge);

    return Object.assign(
      {},
      img,
      {
        url: result.replace('http://', 'https://')
      }
    );
  }


  /**
  * Truncates strings to 250 characters, attempting to preserve whole words
  * @param str {string} the string to truncate
  * @param limit {Number} the maximum character length to return
  * @param trailing {string} a trailing string to denote truncation, e.g. '...'
  * @param sep {string} the word separator
  * @returns {string}
  */
  static truncate(str, limit = 250, trailing = '...', sep = ' ') {
    if (!str || str.length <= limit) {
      return str;
    }

    // TODO (bmcginnis): split punctuation too so we don't end up with "foo,..."
    const words = str.split(sep);
    const max = limit - trailing.length;
    let truncated = '';

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      if (truncated.length + word.length > max ||
        (i !== 0 && truncated.length + word.length + sep.length > max)) {
        truncated += trailing;
        break;
      }

      truncated += i === 0 ? word : sep + word;
    }

    return truncated;
  }

  static openStatus(profile) {
    if (!profile.hours) {
      return '';
    }

    const days = this._formatHoursForAnswers(profile.hours, profile.timeZoneUtcOffset);
    if (days.length === 0) {
      return '';
    }


    const { time, day } = this._calculateYextDayTime(new Date(), profile.timeZoneUtcOffset);
    let hours = {
        days: days,
        time: time,
        day: day,
        dayIndex: this._dayToInt(day),
      };

    hours.yextDays = this._prepareIntervals(hours);
    let { status, nextTime, nextDay } = this._getStatus(hours);
    hours.nextTime =  nextTime;
    hours.nextDay = nextDay;
    hours.status = status;

    return this._getTodaysMessage({ hoursToday: hours, isTwentyFourHourClock: false });
  }

  static _prepareIntervals({ days }) { //days is a parsed json of hours.days
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
    for(let i = 0; i < 7; i++) {
      let index = (tomorrow + i) % 7;
      for (let interval of yextDays[index].intervals) {
        return {status: "OPENSNEXT", nextTime: interval.start, nextDay: this._intToDay(index)};
      }
    }
  }

  //the idea is to get the YextDay objects for yesterday and today. we ask yesterday
  //if it has an interval that overlaps into today (5pm - 3am) using this._isOpenYesterday.
  //we then ask today if it has an interval that is open at the current time using isOpen.
  //is isOpenYesterday(yesterday) is true, then we return CLOSESTODAY with the interval overlapping from yesterday.
  //if today.isOpen is true, we check if it is 24 hours, if not we return CLOSESTODAY at the interval returned from isOpen.
  //else the store is closed and either opens sometime later today or at the next open interval sometime later in the week
  static _getStatus({ time, day, yextDays }) {
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
        return { status: "OPEN24", dayWithHours: yextDays[today]};
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
  static _is24Hours(intervals) {
    for (let interval of intervals) {
      if(interval.start == 0 && interval.end == 2359) {
        return {is24: true, interval};
      }
    }
    return {is24: false};
  }

  //given current time, check status with context: today
  //return boolean with open status and current interval
  static _isOpen(intervals, time) {
    for (let interval of intervals) {
      if ((interval.start <= time && time < interval.end) || (interval.start <= time && interval.end <= interval.start) || (interval.start == 0 && interval.end == 2359)) {
        return {isOpen: true, interval};
      }
    }
    return {isOpen: false};
  }

  //given time, check if there is an interval today that the location opens
  static _hasOpenIntervalToday(intervals, time) {
    for (let interval of intervals) {
      if (time < interval.start) {
        return {hasOpen: true, interval};
      }
    }
    return {hasOpen: false};
  }

  //given current time, check status with context: yesterday
  //for example: if today is Tuesday and it is 2am and Monday had an interval open from 12pm-3am, Monday.isOpenYesterday will return true
  //return boolean with open status and current interval
  static _isOpenYesterday(intervals, time) {
    for (let interval of intervals) {
      if (time < interval.end && interval.end <= interval.start) {
        return {isOpen: true, interval};
      }
    }
    return {isOpen: false};
  }

  static _dayToInt(d) {
    switch (d) {
      case "SUNDAY": return 0;
      case "MONDAY": return 1;
      case "TUESDAY": return 2;
      case "WEDNESDAY": return 3;
      case "THURSDAY": return 4;
      case "FRIDAY": return 5;
      case "SATURDAY": return 6;
    }
    throw "[this._dayToInt]: Invalid Day: " + d;
  }

  static _intToDay(i) {
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

  static _formatHoursForAnswers(days, timezone) {
    const daysOfWeek = [
      'SUNDAY',
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY',
    ];
    const holidayHours = days.holidayHours || [];
    for (let day in days) {
      if (day === 'holidayHours' || day === 'reopenDate') {
        delete days[day];
      } else {
        const currentDayName = day.toUpperCase();
        const numberTimezone = this._convertTimezoneToNumber(timezone);
        const userDateToEntityDate = this._getDateWithUTCOffset(numberTimezone);
        const dayNameToDate = this._getNextDayOfWeek(userDateToEntityDate, daysOfWeek.indexOf(currentDayName));

        for (let holiday of holidayHours) {
          let holidayDate = new Date(holiday.date + 'T00:00:00.000');
          if (dayNameToDate.toDateString() == holidayDate.toDateString()) {
            holiday.intervals = this._formatIntervals(holiday.openIntervals);
            if (!holiday.intervals) {
              holiday.intervals = [];
            }
            days[day].dailyHolidayHours = holiday;
          }
        }

        days[day].day = day.toUpperCase();

        let intervals = days[day].openIntervals;
        if (intervals) {
          for (let interval of intervals) {
            for (let period in interval) {
              interval[period] = parseInt(interval[period].replace(':', ''));
            }
          }
        } else {
          days[day].openIntervals = [];
        }
        days[day].intervals = days[day].openIntervals;
      }
    }

    return Object.values(days);
  }

  // "-05:00 -> -5
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

  static _formatIntervals(intervals) {
    if (!intervals) {
      return intervals;
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
   * Calculates a yext time and date using utc offsets
   * If no valid utc offsets are found, time and date will
   * be based off of clients local time.
   *
   * Example
   *
   * Users local time in EDT (now): Fri Jun 21 2019 14:21:10 GMT-0400
   * Their localUtcOffset will be +4 hours (for user offset, +/- is flipped)
   *
   * They are viewing a store in germany, CEST/GMT+2
   * For this date, the utcOffset will be +2 hours (for entity offset, +/- is normal)
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
   * @param {{start: number, offset: number}[]} utcOffsets
   */
  static _calculateYextDayTime(now, utcOffsets) {
    // Get offset data from store page metadata

    // Init UTC offset as just zero
    let utcOffset = 0;

    // Get the UTC offset of the clients timezone (minutes converted to millis)
    const localUtcOffset = now.getTimezoneOffset() * 60 * 1000;

    // If the store has UTC offset data, loop through the data
    if (utcOffsets && utcOffsets.length) {
      for (const offsetPeriod of utcOffsets) {

        // The store offset data is provided as a list of dates with timestamps
        // Only use offsets that are valid, which are offsets that started prior to the current time
        if (offsetPeriod.start * 1000 < now.valueOf()) {
          utcOffset = offsetPeriod.offset * 1000;
        }
      }
    }

    // If a valid offset was found, set the today value to a new date that accounts for the store & local UTC offsets
    if (utcOffset !== 0) {
      now = new Date(now.valueOf() + utcOffset + localUtcOffset);
    }
    const time = this._getYextTime(now);
    const day = this._getYextDay(now);

    return {time, day};
  }

  static _getYextTime(date) {
    return date.getHours() * 100 + date.getMinutes();
  }

  static _getYextDay(date) {
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

  static _getTodaysMessage({ hoursToday, isTwentyFourHourClock }) {
    let time, day;
    switch (hoursToday.status) {
      case 'OPEN24':
        return `<span class="Hours-statusText">Open 24 Hours</span>`;
      case 'OPENSTODAY':
        time = this._getTimeString(hoursToday.nextTime, isTwentyFourHourClock);
        return `
          <span class="Hours-statusText">
            <span class="Hours-statusText--current">
              Closed
            </span> · Opens at <span class="HoursInterval-time">
              ${time}
            </span>
          </span>`;
      case 'OPENSNEXT':
        time = this._getTimeString(hoursToday.nextTime, isTwentyFourHourClock);
        day = this._translateDay(hoursToday.nextDay);
        return `
          <span class="Hours-statusText">
            <span class="Hours-statusText--current">
              Closed
            </span> · Opens at
          </span>
          <span class="HoursInterval-time">
            ${time}
          </span>
          <span class="HoursInterval-day">
            ${day}
          </span>`;
      case 'CLOSESTODAY':
        time = this._getTimeString(hoursToday.nextTime, isTwentyFourHourClock);
        return `
          <span class="Hours-statusText">
            <span class="Hours-statusText--current">
            Open Now
            </span> · Closes at
          </span>
          <span class="HoursInterval-time">
            ${time}
          </span>`;
      case 'CLOSESNEXT':
        time = this._getTimeString(hoursToday.nextTime, isTwentyFourHourClock);
        day = this._translateDay(hoursToday.nextDay);
        return `
          <span class="Hours-statusText">
            <span class="Hours-statusText--current">
              Open Now
            </span> · Closes at
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
            Closed
          </span>`;
      default:
        return '';
    }
  }

  static _translateDay(day) {
    switch (day) {
      case 'MONDAY':
        return 'Monday';
      case 'TUESDAY':
        return 'Tuesday'
      case 'WEDNESDAY':
        return 'Wednesday'
      case 'THURSDAY':
        return 'Thursday'
      case 'FRIDAY':
        return 'Friday';
      case 'SATURDAY':
        return 'Saturday'
      case 'SUNDAY':
        return 'Sunday';
    }
    return -1;
  }

  static _getTimeString(yextTime, twentyFourHourClock) {
    let time = new Date();
    time.setHours(Math.floor(yextTime / 100));
    time.setMinutes(yextTime % 100);
    return time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: !twentyFourHourClock })
  }

  /**
   * @param {Object} cta Call To Action field type
   * @return {string} The formatted url associated with the Call to Action object if the cta object exists, null otherwise
   */
  static generateCTAFieldTypeLink(cta) {
    if (!cta) {
      return null;
    }
    return CtaFormatter.generateCTAFieldTypeLink(cta);
  }
}

global.Formatter = Formatters;
