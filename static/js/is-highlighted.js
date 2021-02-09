/**
 * Checks if the given field has highlighted substrings.
 * 
 * @param {string} fieldId The field's id.
 * @param {Object} highlightedFields An Object, keyed by field id, that includes the
 *                                   higlight metadata for all applicable fields.
 * @returns {boolean}
 */
export function isHighlighted(fieldId, highlightedFields) {
  return Object.keys(highlightedFields).includes(fieldId);
}