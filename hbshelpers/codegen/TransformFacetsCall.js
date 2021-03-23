/**
 * Responsible for generating transformFacets function calls based on the fields config option
 */
class TransformFacetsCall {
  static generate (fields) {
    return `facets => {
      return facets.map(facet => {
        let options = facet.options;
        ${this._generateFacetModificationCode(fields)}
        return Object.assign({}, facet, { options });
      });
    }`
  }

  static _generateFacetModificationCode (fields) {
    return Object.entries(fields).reduce((acc, [fieldId, fieldOptions]) => {
      return acc + `if (facet.fieldId === '${fieldId}') {
        ${this._generateFilterOptionsCode(fieldOptions)}
        ${this._generateFacetOptionsModificationCode(fieldOptions.fieldLabels)}
      }\n`;
    }, '');
  }

  static _generateFilterOptionsCode (fieldOptions) {
    return Object.entries(fieldOptions).reduce((acc, [option, value]) => {
      return option !== 'fieldLabels'
        ? acc + `facet['${option}'] = '${value}';\n`
        : acc;
    }, '');
  }

  static _generateFacetOptionsModificationCode (fieldLabels) {
    if (!fieldLabels) {
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