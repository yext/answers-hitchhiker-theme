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

/**
 * Returns a utf-8 encoding of an SVG
 *
 * @param {string} svg The SVG to encode
 * @return {string}
 */
const getEncodedSvg = (svg) => {
  return `data:image/svg+xml;charset=utf-8, ${encodeURIComponent(svg)}`;
}

/**
 * Returns whether or not targetEl is viewable within containerEl, considering
 * its container's scroll position and the target's offset from the top
 *
 * @param {HTMLElement} targetEl The element that is meant to be viewable
 * @param {HTMLElement} containerEl The wrapper element, should be some ancestor for targetEl
 * @return {boolean}
 */
const isViewableWithinContainer = (targetEl, containerEl) => {
  const containerElViewableTop = containerEl.scrollTop;
  const containerElViewableBottom = containerEl.scrollTop + containerEl.offsetHeight;
  const targetElTop = targetEl.offsetTop;
  const targetElBottom = targetEl.offsetTop + targetEl.offsetHeight;

  const isScrolledIntoView =
    targetElTop >= containerElViewableTop &&
    targetElTop <= containerElViewableBottom &&
    targetElBottom >= containerElViewableTop &&
    targetElBottom <= containerElViewableBottom;
  return isScrolledIntoView;
};


/**
 * Normalize lng to the range [-180, 180]. If you give -181, for
 * example, we wrap back to 179. If lng is 180, we return 180. Otherwise, we
 * prefer to return -180 over 180 when wrapping, as they are the same coordinate.
 *
 * The idea is that we must mod by the range of the longitude values (360) to
 * be span our entire range of values. In order to have our negative to
 * positive wrapping work with modulus, the values we mod by need to be positive.
 *
 * 1. Add 180 to shift values to make sure -180 to 0 map to 0 to 180 
 *    and 0 to 180 map to 180 to 360 for example
 * 2. Mod by 360 to make the range (-360, 360)
 * 3. Add 360 and mod by 360 again to make the range positive [0, 360)
 * 4. Subtract by 180 to make the range into the desired range [-180, 180)
 *
 * @param {Number} lng The longitude
 * @returns {Number} The normalized longitude
 */
const getNormalizedLongitude = (lng) => {
  if (lng === 180) {
    return lng;
  }
  const range = 360; // 180 - (-180)
  return ((lng + 180) % range + range) % range - 180;
}

export {
  getLanguageForProvider,
  getEncodedSvg,
  getNormalizedLongitude,
  isViewableWithinContainer
}
