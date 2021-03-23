/**
 * Responsible for generating transformFacets function calls
 */
class TransformFacetsCall {
  /**
   * Generates a transformFacets function based on the fields config
   * 
   * @param {Object} fields filterOptions keyed by fieldId
   */
  static generate (fields) {
    return `(facets, config) => {
      return facets.map(facet => {
        let options = facet.options;
        ${this._generateFacetModificationCode(fields)}
        return Object.assign({}, facet, { options });
      });
    }`
  }

  /**
   * Generates code which modifies the in-scope facet based on the fields config
   * 
   * @param {Object} fields filterOptions keyed by fieldId
   */
  static _generateFacetModificationCode (fields) {
    if (typeof fields !== 'object') {
      return '';
    }
    return Object.entries(fields).reduce((acc, [fieldId, filterOptions]) => {
      return acc + `if (facet.fieldId === '${fieldId}') {
        ${this._generateFilterOptionsSetterCode(filterOptions)}
        ${this._generateFacetOptionsModificationCode(filterOptions.fieldLabels)}
      }\n`;
    }, '');
  }

  /**
   * Generates code which sets filterOptions on the in-scope facet. The fieldLabels
   * option is not included because it is processed separately.
   * 
   * @param {Object} filterOptions option values keyed by option name
   */
  static _generateFilterOptionsSetterCode (filterOptions) {
    if (typeof filterOptions !== 'object') {
      return '';
    }
    return Object.entries(filterOptions).reduce((acc, [option, value]) => {
      if (option === 'fieldLabels') {
        return acc;
      }
      if (typeof value === 'boolean' || typeof value === 'number'){
        return acc + `facet['${option}'] = ${value};\n`;
      }
      return acc + `facet['${option}'] = '${value}';\n`;
    }, '');
  }

  /**
   * Generates code which modifies the display names of the in-scope DisplayableFacetOption array
   * 
   * @param {Object} fieldLabels new option display names keyed by old display names
   */
  static _generateFacetOptionsModificationCode (fieldLabels) {
    if (typeof fieldLabels !== 'object') {
      return '';
    }
    const displayNameTransformationsCode =
      Object.entries(fieldLabels).reduce((acc, [oldDisplayName, newDisplayName]) => {
        return acc + `if (displayName === '${oldDisplayName}' ) { displayName = '${newDisplayName}'; }\n`;
      }, '');

    return `options = options.map(option => {
      let displayName = option.displayName;
      ${displayNameTransformationsCode}
      return Object.assign({}, option, { displayName });
    });\n`;
  }
}

module.exports = TransformFacetsCall;