/**
 * Returns true if the value is either the boolean value
 * 'true' or a string representation of 'true'
 * 
 * @param {string|boolean} value
 * @returns {boolean}
 */
export function canonicalizeBoolean (value) {
  if (typeof(value) === 'string') {
    return value.toLowerCase() === 'true';
  } else if (typeof(value) === 'boolean') {
    return value;
  } else {
    return false;
  }
}