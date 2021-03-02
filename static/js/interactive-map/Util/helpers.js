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

export {
  getLanguageForProvider,
  getEncodedSvg,
  isViewableWithinContainer
}
