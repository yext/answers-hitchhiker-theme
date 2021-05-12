/**
 * Returns an object which contains the data-hhconfig attributes on the element specified by the selector
 * 
 * @example
 * If the attributes on the element contain 'data-hhconfig-link-target="_top"', the returned
 * object will be { link-target: "_top" }
 *
 * @param {string} selector
 * @returns {Object}
 */
export default function getHHConfigAttributes (selector) {
  const element = document.querySelector(selector);
  if (!element) {
    return {};
  }
  const attributes = element.attributes;
  // attributes is not an array, but it is shaped like one, and that allows us to use
  // the array filter function through a call
  const hhConfigAttributes = [].filter.call(attributes, attr => {
    return /^data-hhconfig-/.test(attr.name);
  });

  return hhConfigAttributes.reduce((acc, attr) => {
    const key = attr.name.replace(/^data-hhconfig-/, '');
    acc[key] =  attr.value; 
    return acc;
  }, {});
}