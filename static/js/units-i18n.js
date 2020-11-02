/**
 * Object containing imperial units
 */
const IMPERIAL = {
  distance: 'mi'
}

/**
 * Object containing metric units
 */
const METRIC = {
  distance: 'km'
}

/**
 * This object is keyed by language and region. If a region isn't defined, it falls back
 * to 'default'
 * @type {Object}
 */
export const LOCALE_UNIT_MAP = {
  en: {
    GB: METRIC,
    AU: METRIC,
    default: IMPERIAL
  },
  es: {
    US: IMPERIAL,
    default: METRIC
  },
  fr: {
    default: METRIC
  },
  de: {
    default: METRIC
  },
  it: {
    default: METRIC
  },
  ja: {
    default: METRIC
  }
};

/**
 * Gets the distance unit for the specified locale
 * @param {string} locale
 * @returns {string} 'km' or 'mi'
 */
export function getDistanceUnit(locale){
  const units = getUnitsForLocale(locale);
  return units['distance'];
};

/**
 * Gets a map of unit types for a specified locale
 * @param {string} locale 
 * @returns {Object}
 */
function getUnitsForLocale(locale) {
  const language = locale.substring(0,2);
  // Note: Getting region this way will be invalid if script tags are used in the future.
  // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl
  // Optionally, we can use Intl.locale() but we would need to polyfill it for IE11
  const region = locale.substring(3,5); 
  const unitSystemFallback = METRIC;
  
  const isKnownLanguage = (language in LOCALE_UNIT_MAP);
  if (!isKnownLanguage) {
    return Object.assign({}, unitSystemFallback);
  }

  const isKnownRegion = (region in LOCALE_UNIT_MAP[language]);
  if (!isKnownRegion) {
    return Object.assign({}, LOCALE_UNIT_MAP[language]['default']);
  }

  return Object.assign({}, LOCALE_UNIT_MAP[language][region]);
}