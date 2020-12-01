import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { components__address__i18n__addressForCountry } from './address-i18n.js'
import CtaFormatter from '@yext/cta-formatter';
import { getDistanceUnit } from './units-i18n';
import OpenStatusMessageFactory from './hours/open-status/messagefactory.js';
import HoursTransformer from './hours/transformer.js';
import HoursStringsLocalizer from './hours/stringslocalizer.js';
import HoursTableBuilder from './hours/table/builder.js';
import { DayNames } from './hours/constants.js';


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
  const addr = profile[key];
  if (!addr) {
    return '';
  }

  const line2 = addr.line2 ? ` ${addr.line2},` : ``;
  const region = addr.region ? ` ${addr.region}` : ``;
  const rawQuery = `${addr.line1},${line2} ${addr.city},${region} ${addr.postalCode} ${addr.countryCode}`;
  const query = encodeURIComponent(rawQuery);

  let url = `https://www.google.com/maps/search/?api=1&query=${query}&output=classic`;

  if (profile.googlePlaceId) {
    url += `&query_place_id=${profile.googlePlaceId}`;
  }

  return url;
}

export function toLocalizedDistance(profile, key = 'd_distance', displayUnits) {
  const locale = _getDocumentLocale();
  const distanceUnits = displayUnits || getDistanceUnit(locale);

  if (distanceUnits === 'mi') {
    return this.toMiles(profile, undefined, undefined, locale);
  } else if (distanceUnits === 'km') {
    return this.toKilometers(profile, undefined, undefined, locale);
  }

  return this.toMiles(profile, undefined, undefined, locale);
}

export function _getDocumentLocale() {
  return document.documentElement.lang.replace('_', '-');
}

export function toKilometers(profile, key = 'd_distance', displayUnits = 'km', locale) {
  if (!profile[key]) {
    return '';
  }
  locale = locale || _getDocumentLocale()
  const distanceInKilometers = profile[key] / 1000; // Convert meters to kilometers
  return new Intl.NumberFormat(locale,
    { style: 'decimal', maximumFractionDigits: 1, minimumFractionDigits: 1})
    .format(distanceInKilometers) + ' ' + displayUnits;
}

export function toMiles(profile, key = 'd_distance', displayUnits = 'mi', locale) {
  if (!profile[key]) {
    return '';
  }
  locale = locale || _getDocumentLocale()
  const distanceInMiles = profile[key] / 1609.344; // Convert meters to miles
  return new Intl.NumberFormat(locale,
    { style: 'decimal', maximumFractionDigits: 1, minimumFractionDigits: 1 })
    .format(distanceInMiles) + ' ' + displayUnits;
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
  const locale = _getDocumentLocale();
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

  const locale = _getDocumentLocale();
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

/**
 * This function pretty prints different kinds of values. Depending on the type,
 * localization may be used.
 *
 * @param {?} obj The value to pretty print.
 * @param {string} locale The current locale.
 * @returns {string} The pretty printed value.
 */
export function prettyPrintObject(obj, locale) {
  locale = locale || _getDocumentLocale();

  switch (typeof obj) {
    case 'string':
    case 'number':
    case 'bigint':
      return obj.toLocaleString(locale);
    case 'boolean':
      return _prettyPrintBoolean(obj, locale)
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

/**
 * Prints the given boolean as a localized affirmative or negative string. For instance,
 * in English, it would return either 'Yes' for True or 'No' for False.
 *
 * @param {boolean} value The boolean value.
 * @param {string} locale The locale indicating which language to use.
 * @returns {string} The localized affirmative or negative.
 */
function _prettyPrintBoolean(value, locale) {
  const language = locale.substring(0,2);
  switch (language) {
    case 'es':
      return value ? 'Sí' : 'No';
    case 'fr':
      return value ? 'Oui' : 'Non';
    case 'it':
      return value ? 'Sì' : 'No';
    case 'de':
      return value ? 'Ja' : 'Nein';
    case 'ja':
      return value ? 'はい' : '番号';
    default:
      return value ? 'Yes' : 'No';
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

    let desiredWidth, desiredHeight;
    let desiredDims = desiredSize.split('x');

    if (desiredDims[0] !== '') {
      desiredWidth = Number.parseInt(desiredDims[0]);
      if (Number.isNaN(desiredWidth)) {
        throw new Error("Invalid width specified");
      }
    }

    if (desiredDims[1] !== '') {
      desiredHeight = Number.parseInt(desiredDims[1]);
      if (Number.isNaN(desiredHeight)) {
        throw new Error("Invalid height specified");
      }
    }
    const thumbnails = image.thumbnails
      .filter(thumb => thumb.width && thumb.height)
      .sort((a, b) => b.width - a.width);
    return atLeastAsLarge
      ? _getSmallestThumbnailOverThreshold(thumbnails, desiredWidth, desiredHeight)
      : _getLargestThumbnailUnderThreshold(thumbnails, desiredWidth, desiredHeight);
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
 * Gets the smallest thumbnail that is over the min width and min height.
 * If no thumbnails are over the given thresholds, will return the closest one.
 *
 * This method assumes all thumbnails have the same aspect ratio, and that
 * thumbnails are sorted in descending size.
 *
 * @param {Array<{{url: string, width: number, height: number}}>} thumbnails 
 * @param {number|undefined} minWidth 
 * @param {number|undefined} minHeight 
 * @returns {string}
 */
function _getSmallestThumbnailOverThreshold(thumbnails, minWidth, minHeight) {
  let index = thumbnails.length - 1;
  while (index > 0) {
    const thumb = thumbnails[index];
    const widthOverThreshold = minWidth ? thumb.width >= minWidth : true;
    const heightOverThreshold = minHeight ? thumb.height >= minHeight : true;
    if (widthOverThreshold && heightOverThreshold) {
      return thumb.url
    }
    index--;
  }
  return thumbnails[0].url;
}

/**
 * Gets the largest thumbnail that is under the max width and max height.
 * If no thumbnails are under the given thresholds, will return the closest one.
 * 
 * This method assumes all thumbnails have the same aspect ratio, and that
 * thumbnails are sorted in descending size.
 *
 * @param {Array<{{url: string, width: number, height: number}}>} thumbnails 
 * @param {number|undefined} maxWidth 
 * @param {number|undefined} maxHeight 
 * @returns {string}
 */
function _getLargestThumbnailUnderThreshold(thumbnails, maxWidth, maxHeight) {
  let index = 0;
  while (index < thumbnails.length) {
    const thumb = thumbnails[index];
    const widthOverThreshold = maxWidth ? thumb.width <= maxWidth : true;
    const heightOverThreshold = maxHeight ? thumb.height <= maxHeight : true;
    if (widthOverThreshold && heightOverThreshold) {
      return thumb.url
    }
    index++;
  }
  return thumbnails[thumbnails.length - 1].url;
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
 * @param {boolean} isTwentyFourHourClock Use 24 hour clock if true, 12 hour clock
 *                  if false. Default based on locale if undefined.
 * @param {String} locale The locale for the time string
 */
export function openStatus(profile, key = 'hours', isTwentyFourHourClock, locale) {
  if (!profile[key]) {
    return '';
  }

  const hours = HoursTransformer.transform(profile[key], profile.timeZoneUtcOffset);
  if (!hours) {
    return '';
  }

  const hoursLocalizer = new HoursStringsLocalizer(
    locale || _getDocumentLocale(), isTwentyFourHourClock);
  return new OpenStatusMessageFactory(hoursLocalizer)
    .create(hours.openStatus);
}

/**
 * Returns the markup for a formatted hours list for the given field on the profile.
 *
 * @param {Object} profile The profile information of the entity
 * @param {Object} opts
 * {
 *   isTwentyFourHourClock {@link boolean} Use 24 hour clock if true, 12 hour clock if
 *                                         false. Default based on locale if undefined.
 *   disableOpenStatus: {@link boolean}   If specified, displays the hours intervals
 *                                      rather than the open status string for today
 *   firstDayInList: {@link string} A day name in English, e.g. "SUNDAY", this day will be
 *                                  displayed first in the list
 * }
 * @param {String} key Indicates which profile property to use for hours
 * @param {String} locale The locale for the time string
 */
export function hoursList(profile, opts = {}, key = 'hours', locale) {
    if (!profile[key]) {
      return '';
    }

    const hours = HoursTransformer.transform(profile[key], profile.timeZoneUtcOffset);
    if (!hours) {
      return '';
    }

    const firstDayInList = opts.firstDayInList && opts.firstDayInList.toUpperCase();
    const isDayValid = Object.values(DayNames).includes(firstDayInList);
    if (firstDayInList && !isDayValid) {
      console.warn(`Invalid day: "${opts.firstDayInList}" provided as "firstDayInList" for the hoursList formatter`);
    }
    const standardizedOpts = {
      disableOpenStatus: opts.disableOpenStatus || false,
      firstDayInList: isDayValid && firstDayInList
    };

    const hoursLocalizer = new HoursStringsLocalizer(
      locale || _getDocumentLocale(), opts.isTwentyFourHourClock);
    return new HoursTableBuilder(hoursLocalizer).build(hours, standardizedOpts);
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

/**
 * Returns a localized price string for the given price field
 * @param {Object} fieldValue The field from LiveAPI, has a value and a currencyCode
 * @param {string} locale The locale to use for formatting, falls back to document locale or 'en'
 * @return {string} The price with correct currency formatting according to locale, if any errors
 *                  returns the price value without formatting
 */
export function price(fieldValue = {}, locale) {
  const localeForFormatting = locale || _getDocumentLocale() || 'en';
  const price = fieldValue.value && parseInt(fieldValue.value);
  const currencyCode = fieldValue.currencyCode && fieldValue.currencyCode.split('-')[0];
  if (!price || isNaN(price) || !currencyCode) {
    console.warn(`No price or currency code in the price fieldValue object: ${fieldValue}`);
    return fieldValue.value;
  }
  return price.toLocaleString(localeForFormatting, { style: 'currency', currency: currencyCode });
}
