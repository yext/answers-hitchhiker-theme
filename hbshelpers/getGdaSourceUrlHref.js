/** KEEP IN SYNC WITH script/core.hbs */

/**
* Searches the raw data JSON for the source URL.
* @param {string|string[]} sourceUrlFields - The field(s) to search for the source
* URL. Can be either a single field or an array of fields.
* @param {Object} rawData - The full raw data JSON of the source
* @returns {string} The source URL, formatted as an href attribute, or an empty 
* string if not found
*/
module.exports = function getGdaSourceUrlHref(sourceUrlFields, rawData) {
  if (sourceUrlFields) {
    const fields = Array.isArray(sourceUrlFields) ? sourceUrlFields : [sourceUrlFields];
    for (const field of fields) {
      const sourceUrl = findFieldInRawData(field, rawData);
      if (sourceUrl) {
        return `href="${sourceUrl}"`;
      }
    }
  }
  return '';
}

/**
* Traverses the raw data JSON to find the leaf field, if it exists.
* @param {string} fieldId - The field we are searching for
* @param {Object} data - The full, or partial, raw data JSON that we are traversing
* @returns {string|undefined} The leaf field value, if it exists
*/
function findFieldInRawData(fieldId, data) {
  const parts = fieldId.split('.');
  let currentValue = data;
  for (const part of parts) {
    if (currentValue[part] === undefined) {
      return undefined;
    }
    currentValue = currentValue[part];
  }
  return isValidUrl(currentValue) ? currentValue : undefined;
}

/**
* Determines if a string is a valid URL.
* @param {string} value - The string to check
* @returns {boolean} Whether the string is a valid URL
*/
function isValidUrl(value) {
  try {
    new URL(value);
    return true;
  } catch (_) {
    return false;
  }
}