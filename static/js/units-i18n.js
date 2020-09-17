/**
 * This object is keyed by language and region. Both region and langauge fallback to
 * default if they aren't found.
 * @type {Object}
 */
const LOCALE_UNIT_MAP = {
  en: {
    GB: {
      distance: 'km'
    },
    AU: {
      distance: 'km'
    },
    US: {
      distance: 'mi'
    },
    default: {
      distance: 'mi'
    }
  },
  es: {
    default: {
      distance: 'km'
    }
  },
  fr: {
    default: {
      distance: 'km'
    }
  },
  de: {
    default: {
      distance: 'km'
    }
  },
  it: {
    default: {
      distance: 'km'
    }
  },
  default: {
    default: {
      distance: 'mi'
    }
  },
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
  
  if (!(language in LOCALE_UNIT_MAP)) {
    return Object.assign({}, LOCALE_UNIT_MAP['default']['default']);
  }

  if (!(region in LOCALE_UNIT_MAP[language])) {
    return Object.assign({}, LOCALE_UNIT_MAP[language]['default']);
  }

  return Object.assign({}, LOCALE_UNIT_MAP[language][region]);
}