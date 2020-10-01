import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { components__address__i18n__addressForCountry } from './address-i18n.js'
import CtaFormatter from '@yext/cta-formatter';
import provideOpenStatusTranslation from './open-status-18n';

import clonedeep from 'lodash.clonedeep';

export function address(profile) {
  if (!profile.address) {
    return '';
  }
  return components__address__i18n__addressForCountry({
    profile: profile,
    derivedData: {address: {stateName: ''}},
    regionAbbr: true,
  });
}

export function phoneLink(profile, key = 'mainPhone') {
  if (!profile[key]) {
    return '';
  }
  return `tel:${profile[key]}`;
}

export function phoneDisplay(profile, key = 'mainPhone') {
  if (!profile[key]) {
    return '';
  }
  return `${profile[key]}`;
}

export function nationalizedPhoneDisplay(profile, key = 'mainPhone') {
  if (!profile[key]) {
    return '';
  }
  const phoneNumber = parsePhoneNumberFromString(profile[key])
  return phoneNumber ? phoneNumber.formatNational() : '';
}

export function emailLink(profile) {
  return profile.emails ? "mailto:" + profile.emails[0] : ''
}

export function getDirectionsUrl(profile, key = 'address') {
  if (profile.googlePlaceId) {
    return `https://www.google.com/maps/place/?q=place_id:${profile.googlePlaceId}`;
  }

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

export function toKilometers(profile, key = 'd_distance', displayUnits = 'km') {
  if (!profile[key]) {
    return '';
  }
  const distanceInKilometers = profile[key] / 1000; // Convert meters to kilometers
  return distanceInKilometers.toFixed(1) + ' ' + displayUnits;
}

export function toMiles(profile, key = 'd_distance', displayUnits = 'mi') {
  if (!profile[key]) {
    return '';
  }
  const distanceInMiles = profile[key] / 1609.344; // Convert meters to miles
  return distanceInMiles.toFixed(1) + ' ' + displayUnits;
}

export function isTodayHoliday(holidayItem, todayDate) {
  if (!holidayItem.date) {
    return false;
  }

  const holidayDate = holidayItem.date.split('-');

  return parseInt(holidayDate[0]) === todayDate.getFullYear() &&
    parseInt(holidayDate[1]) === todayDate.getMonth() + 1 &&
    parseInt(holidayDate[2]) === todayDate.getDate()
}

export function _getProfileFieldAtKeyPath(profile, keypath) {
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

export function bigDate(profile, keyPath = 'time.start') {
  const dateString = _getProfileFieldAtKeyPath(profile, keyPath);
  if (!dateString) {
    return null;
  }

  const date = betterTime(dateString);
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

export function betterTime(stamp) {
  const offset = new Date(stamp).getTimezoneOffset() / 60;
  const offsetStr = (offset < 0 ? '+0' : '-0') + Math.abs(offset) + ':00';
  return new Date(stamp + offsetStr);
}

export function dateRange(
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
  const start = betterTime(dateField.start);
  const end = betterTime(dateField.end);
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

export function snakeToTitle(snake) {
  return snake.split('_')
    .map(frag => `${frag.charAt(0).toUpperCase()}${frag.slice(1)}`)
    .join(' ');
}

export function prettyPrintObject(obj) {
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
        return obj.map(sub => prettyPrintObject(sub)).join('<br>');
      }
      return Object.entries(obj)
        .map(([_, val]) => prettyPrintObject(val)).join(', ');
    default:
      return '';
  }
}

export function joinList(list, separator) {
  if (!list) {
    return '';
  }
  return list.join(separator);
}

/*
 * Given object with url and alternateText, changes url to use https
 */
export function image(simpleOrComplexImage = {}, size = '200x', atLeastAsLarge = true) {
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
export function truncate(str, limit = 250, trailing = '...', sep = ' ') {
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

/**
 * Returns a string, a formatted representation of the open hours status
 * for the given profile.
 * @param {Object} profile The profile information of the entity
 * @param {String} key Indicates which profile property to use for hours
 * @param {boolean} isTwentyFourHourClock Use 24 hour vs 12 hour formatting for time string
 * @param {String} locale The locale for the time string
 */
export function openStatus(profile, key = 'hours', isTwentyFourHourClock = false, locale = 'en-US') {
  if (!profile[key]) {
    return '';
  }

  const days = _formatHoursForAnswers(profile[key], profile.timeZoneUtcOffset);
  if (days.length === 0) {
    return '';
  }


  const { time, day } = _calculateYextDayTime(new Date(), profile.timeZoneUtcOffset);

  /**
   * @type {{days: Object[], time: number, day: string, dayIndex: number }}
   */
  let hours = {
    days: days,
    time: time,
    day: day,
    dayIndex: _dayToInt(day),
  };

  hours.yextDays = _prepareIntervals(hours);
  let { status, nextTime, nextDay } = _getStatus(hours);
  hours.nextTime =  nextTime;
  hours.nextDay = nextDay;
  hours.status = status;

  return _getTodaysMessage({ hoursToday: hours, isTwentyFourHourClock, locale: locale });
}

export function _prepareIntervals({ days }) { //days is a parsed json of hours.days
  let results = [];
  for (const { intervals, day, dailyHolidayHours } of days) { //iterate through each day within days
    if (dailyHolidayHours) { //prioritize holiday hours over intervals
      results[_dayToInt(day)] = {
        dayName: day,
        dayIndex: _dayToInt(day),
        intervals: dailyHolidayHours.isRegularHours ? intervals : dailyHolidayHours.intervals,
      };
    } else {
      results[_dayToInt(day)] = {
        dayName: day,
        dayIndex: _dayToInt(day),
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
export function _getNextInterval(yextDays, tomorrow) {
  for(let i = 0; i < 7; i++) {
    let index = (tomorrow + i) % 7;
    for (let interval of yextDays[index].intervals) {
      return {status: "OPENSNEXT", nextTime: interval.start, nextDay: _intToDay(index)};
    }
  }
}

//the idea is to get the YextDay objects for yesterday and today. we ask yesterday
//if it has an interval that overlaps into today (5pm - 3am) using _isOpenYesterday.
//we then ask today if it has an interval that is open at the current time using isOpen.
//is isOpenYesterday(yesterday) is true, then we return CLOSESTODAY with the interval overlapping from yesterday.
//if today.isOpen is true, we check if it is 24 hours, if not we return CLOSESTODAY at the interval returned from isOpen.
//else the store is closed and either opens sometime later today or at the next open interval sometime later in the week
export function _getStatus({ time, day, yextDays }) {
  const negMod = (n, m) => ((n % m) + m) % m; // JavaScript doesnt support modulo on negative numbers
  let yesterday = _dayToInt(day) - 1;
  yesterday = negMod(yesterday, 7);
  let today = _dayToInt(day);
  let yesterdayIsOpen = _isOpenYesterday(yextDays[yesterday].intervals, time);
  let todayIsOpen = _isOpen(yextDays[today].intervals, time);
  let hasOpenIntervalToday = _hasOpenIntervalToday(yextDays[today].intervals, time);

  if (yesterdayIsOpen.isOpen) {
    //check if any hours from yesterday are valid
    //dayWithHours is used to render the proper day on the hours table
    return { status: "CLOSESTODAY", nextTime: yesterdayIsOpen.interval.end, dayWithHours: yextDays[yesterday] };
  } else if (todayIsOpen.isOpen) {
    //check if open now
    if (_is24Hours(yextDays[today].intervals).is24) {
      return { status: "OPEN24", dayWithHours: yextDays[today]};
    }
    //if not 24 hours, closes later today at the current intervals end time
    return { status: "CLOSESTODAY", nextTime: todayIsOpen.interval.end, dayWithHours: yextDays[today] };
  } else if (hasOpenIntervalToday.hasOpen) {
    //check if closed and has an interval later today
    return { status: "OPENSTODAY", nextTime: hasOpenIntervalToday.interval.start, dayWithHours: yextDays[today] };
  } else {
    //check if closed, get next available interval. if no intervals available return closed status without nextTime or nextDay
    let nextInfo = _getNextInterval(yextDays, today + 1);
    if (nextInfo) {
      nextInfo.dayWithHours = yextDays[today];
    }
    return nextInfo || { status: "CLOSED", dayWithHours: yextDays[today] };
  }
}

//check if today has a 24 hr interval
export function _is24Hours(intervals) {
  for (let interval of intervals) {
    if(interval.start == 0 && interval.end == 2359) {
      return {is24: true, interval};
    }
  }
  return {is24: false};
}

//given current time, check status with context: today
//return boolean with open status and current interval
export function _isOpen(intervals, time) {
  for (let interval of intervals) {
    if ((interval.start <= time && time < interval.end) || (interval.start <= time && interval.end <= interval.start) || (interval.start == 0 && interval.end == 2359)) {
      return {isOpen: true, interval};
    }
  }
  return {isOpen: false};
}

//given time, check if there is an interval today that the location opens
export function _hasOpenIntervalToday(intervals, time) {
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
export function _isOpenYesterday(intervals, time) {
  for (let interval of intervals) {
    if (time < interval.end && interval.end <= interval.start) {
      return {isOpen: true, interval};
    }
  }
  return {isOpen: false};
}

export function _dayToInt(d) {
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

export function _intToDay(i) {
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
export function _formatHoursForAnswers(days, timezone) {
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
      const numberTimezone = _convertTimezoneToNumber(timezone);
      const userDateToEntityDate = _getDateWithUTCOffset(numberTimezone);
      const dayNameToDate = _getNextDayOfWeek(userDateToEntityDate, daysOfWeek.indexOf(currentDayName));

      for (let holiday of holidayHours) {
        let holidayDate = new Date(holiday.date + 'T00:00:00.000');
        if (dayNameToDate.toDateString() == holidayDate.toDateString()) {
          holiday.intervals = _formatIntervals(holiday.openIntervals);
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
export function _convertTimezoneToNumber(timezone) {
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

export function _getDateWithUTCOffset(inputTzOffset) {
  var now = new Date(); // get the current time

  var currentTzOffset = -now.getTimezoneOffset() / 60 // in hours, i.e. -4 in NY
  var deltaTzOffset = inputTzOffset - currentTzOffset; // timezone diff

  var nowTimestamp = now.getTime(); // get the number of milliseconds since unix epoch
  var deltaTzOffsetMilli = deltaTzOffset * 1000 * 60 * 60; // convert hours to milliseconds (tzOffsetMilli*1000*60*60)
  var outputDate = new Date(nowTimestamp + deltaTzOffsetMilli) // your new Date object with the timezone offset applied.

  return outputDate;
}

export function _getNextDayOfWeek(date, dayOfWeek) {
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
export function _formatIntervals(intervals) {
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
export function _calculateYextDayTime(now, timezoneUtcOffset) {
  // Get the UTC offset of the clients timezone (minutes converted to millis)
  const localUtcOffset = now.getTimezoneOffset() * 60 * 1000;

  // Get the entity's offset in millis
  const entityUtcOffsetInHours = _convertTimezoneToNumber(timezoneUtcOffset);
  const entityUtcOffsetMillis = entityUtcOffsetInHours * 60 * 60 * 1000;

  // If a valid offset was found, set the today value to a new date that accounts for the entity & local UTC offsets
  if (entityUtcOffsetMillis !== 0) {
    now = new Date(now.valueOf() + entityUtcOffsetMillis + localUtcOffset);
  }
  const time = _getYextTime(now);
  const day = _getYextDay(now);

  return {time, day};
}

/**
 * @param {Date} date
 * @returns {number} a number like 1425, which represents 02:25 PM
 */
export function _getYextTime(date) {
  return date.getHours() * 100 + date.getMinutes();
}

export function _getYextDay(date) {
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

export function _translate(text, translationData) {
  if (!translationData.hasOwnProperty(text)) {
    console.error(`Could not translate "${text}".`);
    return text;
  }
  return translationData[text];
}

export function _getTodaysMessage({ hoursToday, isTwentyFourHourClock, locale }) {
  let time, day;
  const translationData = provideOpenStatusTranslation(locale);
  const translate = text => _translate(text, translationData);
  switch (hoursToday.status) {
    case 'OPEN24':
      return `<span class="Hours-statusText">${translate('Open 24 Hours')}</span>`;
    case 'OPENSTODAY':
      time = _getTimeString(hoursToday.nextTime, isTwentyFourHourClock, locale);
      return `
          <span class="Hours-statusText">
            <span class="Hours-statusText--current">
              ${translate('Closed')}
            </span> · ${translate('Opens at')} <span class="HoursInterval-time">
              ${time}
            </span>
          </span>`;
    case 'OPENSNEXT':
      time = _getTimeString(hoursToday.nextTime, isTwentyFourHourClock, locale);
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
      time = _getTimeString(hoursToday.nextTime, isTwentyFourHourClock, locale);
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
      time = _getTimeString(hoursToday.nextTime, isTwentyFourHourClock, locale);
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

export function _getTimeString(yextTime, twentyFourHourClock, locale = 'en-US') {
  let time = new Date();
  time.setHours(Math.floor(yextTime / 100));
  time.setMinutes(yextTime % 100);

  return time.toLocaleString(locale, {
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: twentyFourHourClock ? 'h24' : 'h12'
  });
}

/**
 * @param {Object} cta Call To Action field type
 * @return {string} The formatted url associated with the Call to Action object if the cta object exists, null otherwise
 */
export function generateCTAFieldTypeLink(cta) {
  if (!cta) {
    return null;
  }
  return CtaFormatter.generateCTAFieldTypeLink(cta);
}
