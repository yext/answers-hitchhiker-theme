import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { components__address__i18n__addressForCountry } from './address-i18n.js'
import { getDistanceUnit } from './units-i18n';
import OpenStatusMessageFactory from './hours/open-status/messagefactory.js';
import HoursTransformer from './hours/transformer.js';
import HoursStringsLocalizer from './hours/stringslocalizer.js';
import HoursTableBuilder from './hours/table/builder.js';
import { DayNames } from './hours/constants.js';
import { generateCTAFieldTypeLink } from './formatters/generate-cta-field-type-link';
import { isChrome } from './useragent.js';
import LocaleCurrency from 'locale-currency'
import getSymbolFromCurrency from 'currency-symbol-map'
import { parseLocale } from './utils.js';
import escape from 'escape-html';

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

export function _getLocaleWithDashes(locale) {
  return locale && locale.replace(/_/g, '-');
}

export function _getDocumentLocale() {
  return _getLocaleWithDashes(document.documentElement.lang);
}

export function toKilometers(profile, key = 'd_distance', displayUnits = 'km', locale) {
  if (!profile[key]) {
    return '';
  }
  locale = _getLocaleWithDashes(locale) || _getDocumentLocale();
  const distanceInKilometers = profile[key] / 1000; // Convert meters to kilometers
  return new Intl.NumberFormat(locale,
    { style: 'decimal', maximumFractionDigits: 1, minimumFractionDigits: 1})
    .format(distanceInKilometers) + ' ' + displayUnits;
}

export function toMiles(profile, key = 'd_distance', displayUnits = 'mi', locale) {
  if (!profile[key]) {
    return '';
  }
  locale = _getLocaleWithDashes(locale) || _getDocumentLocale();
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
  locale = _getLocaleWithDashes(locale) || _getDocumentLocale();

  switch (typeof obj) {
    case 'string':
    case 'number':
    case 'bigint':
      return obj.toLocaleString(locale);
    case 'boolean':
      return _prettyPrintBoolean(obj);
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
 * @returns {string} The localized affirmative or negative.
 */
function _prettyPrintBoolean(value) {
  const text = value ? 'Yes' : 'No';
  return window.translations[text];
}

export function joinList(list, separator) {
  if (!list) {
    return '';
  }
  return list.join(separator);
}

/**
 * Given an image object with a url, changes the url to use dynamic thumbnailer and https.
 * 
 * Note: A dynamic thumbnailer url generated with atLeastAsLarge = true returns an image that is
 * at least as large in one dimension of the desired size. In other words, the returned image will
 * be at least as large, and as close as possible to, the largest image that is contained within a
 * box of the desired size dimensions.
 * 
 * If atLeastAsLarge = false, the dynamic thumbnailer url will give the largest image that is
 * smaller than the desired size in both dimensions.
 * 
 * @param {Object} simpleOrComplexImage An image object with a url
 * @param {string} desiredSize The desired size of the image ('<width>x<height>')
 * @param {boolean} atLeastAsLarge Whether the image should be at least as large as the desired
 *                                 size in one dimension or smaller than the desired size in both
 *                                 dimensions.
 * @returns {Object} An object with a url for dynamic thumbnailer
 */
export function image(simpleOrComplexImage = {}, desiredSize = '200x', atLeastAsLarge = true) {
  let image = simpleOrComplexImage.image || simpleOrComplexImage;
  if (!image) {
    return {};
  }
  if (!image.url) {
    return image;
  }
  if (!(Object.prototype.toString.call(image).indexOf('Object') > 0)) {
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

  let desiredWidth, desiredHeight;
  let desiredDims = desiredSize.split('x');

  const [urlWithoutExtension, extension] = _splitStringOnIndex(image.url, image.url.lastIndexOf('.'));
  const [urlBeforeDimensions, dimensions] = _splitStringOnIndex(urlWithoutExtension, urlWithoutExtension.lastIndexOf('/') + 1);
  const fullSizeDims = dimensions.split('x');

  if (desiredDims[0] !== '') {
    desiredWidth = Number.parseInt(desiredDims[0]);
    if (Number.isNaN(desiredWidth)) {
      throw new Error("Invalid width specified");
    }
  } else {
    desiredWidth = atLeastAsLarge ? 1 : Number.parseInt(fullSizeDims[0]);
  }

  if (desiredDims[1] !== '') {
    desiredHeight = Number.parseInt(desiredDims[1]);
    if (Number.isNaN(desiredHeight)) {
      throw new Error("Invalid height specified");
    }
  } else {
    desiredHeight = atLeastAsLarge ? 1 : Number.parseInt(fullSizeDims[1]);
  }

  const urlWithDesiredDims = urlBeforeDimensions + desiredWidth + 'x' + desiredHeight + extension;

  const dynamicUrl = atLeastAsLarge
    ? _replaceUrlHost(urlWithDesiredDims, 'dynl.mktgcdn.com')
    : _replaceUrlHost(urlWithDesiredDims, 'dynm.mktgcdn.com');

  return Object.assign(
    {},
    image,
    {
      url: dynamicUrl.replace('http://', 'https://')
    }
  );
}

/**
 * Splits a string into two parts at the specified index.
 * 
 * @param {string} str The string to be split
 * @param {number} index The index at which to split the string
 * @returns {Array<string>} The two parts of the string after splitting
 */
function _splitStringOnIndex(str, index) {
  return [str.slice(0, index), str.slice(index)];
}

/**
 * Replaces the current host of a url with the specified host.
 * 
 * @param {string} url The url whose host is to be changed
 * @param {string} host The new host to change to
 * @returns {string} The url updated with the specified host
 */
function _replaceUrlHost(url, host) {
  const splitUrl = url.split('://');
  const urlAfterHost = splitUrl[1].slice(splitUrl[1].indexOf('/'));
  return splitUrl[0] + '://'  + host + urlAfterHost;
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
    _getLocaleWithDashes(locale) || _getDocumentLocale(), isTwentyFourHourClock);
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
      _getLocaleWithDashes(locale) || _getDocumentLocale(), opts.isTwentyFourHourClock);
    return new HoursTableBuilder(hoursLocalizer).build(hours, standardizedOpts);
}

export { generateCTAFieldTypeLink };

/**
 * Returns a localized price string for the given price field
 * @param {Object} fieldValue The field from LiveAPI, has a value and a currencyCode
 * @param {string} locale The locale to use for formatting, falls back to document locale or 'en'
 * @return {string} The price with correct currency formatting according to locale, if any errors
 *                  returns the price value without formatting
 */
export function price(fieldValue = {}, locale) {
  const localeForFormatting =  _getLocaleWithDashes(locale) || _getDocumentLocale() || 'en';
  const price = fieldValue.value && parseFloat(fieldValue.value);
  const currencyCode = fieldValue.currencyCode && fieldValue.currencyCode.split('-')[0];
  if (!price || isNaN(price) || !currencyCode) {
    console.warn(`No price or currency code in the price fieldValue object: ${fieldValue}`);
    return fieldValue.value;
  }
  return price.toLocaleString(localeForFormatting, { style: 'currency', currency: currencyCode });
}

/**
 * Returns a localized price range string for the given price range ($-$$$$) and country code (ISO format).
 * If country code is invalid or undefined, use locale of the site to determine the currency symbol.
 * If all else fails, use the default priceRange with dollar sign.
 * @param {string} defaultPriceRange The price range from LiveAPI entity
 * @param {string} countrycode The country code from LiveAPI entity (e.g. profile.address.countryCode)
 * @return {string} The price range with correct currency symbol formatting according to country code
 */
export function priceRange(defaultPriceRange, countryCode) {
  if (!defaultPriceRange) {
    console.warn(`Price range is not provided.`);
    return '';
  }
  if (countryCode) {
    const currencySymbol = getSymbolFromCurrency(LocaleCurrency.getCurrency(countryCode));
    if (currencySymbol) {
      return defaultPriceRange.replace(/\$/g, currencySymbol); 
    }
  }
  const { region, language } = parseLocale(_getDocumentLocale());
  const currencySymbol = getSymbolFromCurrency(LocaleCurrency.getCurrency(region || language));
  if (currencySymbol) {
    return defaultPriceRange.replace(/\$/g, currencySymbol); 
  }
  console.warn('Unable to determine currency symbol from '
    + `ISO country code "${countryCode}" or locale "${_getDocumentLocale()}".`);
  return defaultPriceRange;
}

/**
 * Highlights snippets of the provided fieldValue according to the matched substrings.
 * Each match will be wrapped in <mark> tags.
 * 
 * @param {string} fieldValue The plain, un-highlighted text.
 * @param {Array<Object>} matchedSubstrings The list of matched substrings to
 *                                          highlight.
 */
export function highlightField(fieldValue, matchedSubstrings = []) {
  let highlightedString = '';

  // We must first sort the matchedSubstrings by ascending offset. 
  const sortedMatches = matchedSubstrings.slice()
    .sort((match1, match2) => match1.offset - match2.offset);
  
  let processedFieldValueIndex = 0;
  sortedMatches.forEach(match => {
    const { offset, length } = match;
    highlightedString += escape(fieldValue.substring(processedFieldValueIndex, offset))
      + `<mark>${escape(fieldValue.substring(offset, offset + length))}</mark>`;
    processedFieldValueIndex = offset + length;
  });
  highlightedString += escape(fieldValue.substring(processedFieldValueIndex));
  return highlightedString;
}

/**
 * Given an array of youtube videos from the KG, returns an embed link for the first video.
 * If it is not possible to get an embed link, null is returned instead.
 *
 * @param {Object[]} videos 
 * @returns {string|null}
 */
export function getYoutubeUrl(videos = []) {
  if (videos.length === 0) {
    return null;
  }
  const videoUrl = videos[0]?.video?.url;
  const youtubeVideoId = videoUrl?.split('watch?v=')[1];
  const youtubeVideoUrl = youtubeVideoId
    ? 'https://www.youtube.com/embed/' + youtubeVideoId + '?enablejsapi=1' 
    : null;
  return youtubeVideoUrl;
}

/**
 * construct a URL that links to a specific portion of a page, using a text snippet provided in the URL.
 * This feature is only available in Chrome.
 * @param {Object} snippet the snippet for the document search direct answer
 * @param {string} baseUrl website or landingPageURL from the entity related to the snippet
 * @returns a URL with text fragment URI component attached
 */
export function getUrlWithTextHighlight(snippet, baseUrl) {
  if (!isChrome() || !snippet || snippet.matchedSubstrings.length === 0 || !baseUrl) {
    return baseUrl;
  }
  //Find the surrounding sentence of the snippet
  let sentenceStart = snippet.matchedSubstrings[0].offset;
  let sentenceEnd = sentenceStart + snippet.matchedSubstrings[0].length;
  const sentenceEnderRegex = /[.\n!\?]/;
  while (!sentenceEnderRegex.test(snippet.value[sentenceStart]) && sentenceStart > 0) {
    sentenceStart -= 1;
  }
  while (!sentenceEnderRegex.test(snippet.value[sentenceEnd]) && sentenceEnd < snippet.value.length) {
    sentenceEnd += 1;
  }
  sentenceStart = sentenceStart === 0 ? sentenceStart : sentenceStart + 2;
  const sentence = snippet.value.slice(sentenceStart, sentenceEnd);
  return baseUrl + `#:~:text=${encodeURIComponent(sentence)}`;
}

/**
 * construct a list of displayable category names based on given category ids from liveAPI
 * and a mapping of category ids to names.
 * 
 * @param {string[]} categoryIds category ids from liveAPI
 * @param {Object[]} categoryMap mapping of category ids to names
 * @param {string} categoryMap[].id id of a category entry
 * @param {string} categoryMap[].category name of a category entry
 * @returns {string[]} a list of category names
 */
export function getCategoryNames(categoryIds, categoryMap) {
  if (!categoryIds || !categoryMap) {
    return [];
  }
  return categoryIds.reduce((list, id) => {
    const categoryEntry = categoryMap.find(category => category.id === id);
    categoryEntry ? list.push(categoryEntry.category) : console.error(`Unable to find category name for id ${id}.`);
    return list;
  }, []);
}
