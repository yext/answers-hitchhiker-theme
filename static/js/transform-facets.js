/**
 * A Facets component transformFacets function which applies the configuration
 * specified by the Facets 'fields' option
 * 
 * @param {DisplayableFacet[]} facets from answers-core
 * @param {FilterOptionsConfig} config from answers-search-ui
 * @returns {DisplayableFacet[]} from answers-core
 */
export default function transformFacets (facets, config) {
  if(!config || !('fields' in config)) {
    return facets;
  }

  return facets.map(facet => {
    const isFacetFieldConfigSpecified = facet.fieldId in config.fields;
    if (!isFacetFieldConfigSpecified) {
      return facet;
    }
    const fieldConfig = config.fields[facet.fieldId];

    const options = facet.options.map(option => {
      if (!('fieldLabels' in fieldConfig)) {
        return option;
      }
      const fieldLabels = fieldConfig.fieldLabels;

      const displayName = (option.displayName in fieldLabels)
        ? fieldLabels[option.displayName]
        : option.displayName;

      return Object.assign({}, option, { displayName });
    });

    const filterOptionsConfig = Object.entries(fieldConfig).reduce((filterOptions, [option, value]) => {
      if (option !== 'fieldLabels') {
        filterOptions[option] = value;
      }
      return filterOptions;
    }, {});
    
    return Object.assign({}, facet, filterOptionsConfig, { options });
  });
}