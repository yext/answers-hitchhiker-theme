import { parseLocale } from './utils';

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
    US: IMPERIAL
  }
};

const unitSystemFallback = METRIC;

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
  const { language, region } = parseLocale(locale);
  
  const isKnownLanguage = (language in LOCALE_UNIT_MAP);
  if (!isKnownLanguage) {
    return Object.assign({}, unitSystemFallback);
  }

  const isKnownRegion = (region in LOCALE_UNIT_MAP[language]);
  if (!isKnownRegion) {
    return Object.assign({}, LOCALE_UNIT_MAP[language]['default'] || unitSystemFallback);
  }

  return Object.assign({}, LOCALE_UNIT_MAP[language][region]);
}