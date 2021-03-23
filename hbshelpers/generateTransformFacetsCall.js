const TransformFacetsCall = require('./codegen/TransformFacetsCall');

/**
 * Generates a transformFacets function based on the Facets 'fields' config option
 * 
 * @param {Object} context 
 * @returns {string}
 */
module.exports = function generateTransformFacetsCall(config) {
  if (!'fields' in config) {
    const identityFunction = 'facets => facets';
    return identityFunction;
  }

  return TransformFacetsCall.generate(config['fields']);
};
