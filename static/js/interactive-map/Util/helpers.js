/**
 * Gets the language locale according to specific fallback logic
 * 1. The user-specified locale to the component
 * 2. If invalid, try using only the first two characters
 * 3. If still invalid, providers fallback to en
 *
 * @param {string} localeStr The user-defined locale string
 * @param {string[]} supportedLocales The locales supported by the current map provider
 * @return {string} The language locale for the map
 */
const getLanguageForProvider = (localeStr, supportedLocales) => {
  if (localeStr.length == 2) {
    return localeStr;
  } 

  if (localeStr.length > 2) {
    if (supportedLocalesForProvider.includes(localeStr)) {
      return localeStr;
    } 
    return localeStr.substring(0, 2);
  }

  return 'en';
};

export {
  getLanguageForProvider
}
