/**
 * Returns true if the value is either the boolean value
 * 'true' or a string representation of 'true'
 * 
 * @param {string|boolean} value
 * @returns {boolean}
 */
export function canonicalizeBoolean (value) {
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true';
  } else if (typeof value === 'boolean') {
    return value;
  } else {
    return false;
  }
}

/**
 * returns language extracted from the provided locale
 * @param {string} locale 
 * @returns {string} language
 */
 export function getLanguageFromLocale(locale) {
  const language = (locale === 'zh-CN' || locale === 'zh-TW')
    ? locale
    : locale.substring(0,2);
  return language;
}
