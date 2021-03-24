/**
 * Transforms the Facets.fields component configuration into a transformFacets function
 * which can be understood by the Answers Search UI.
 * 
 * @param {DisplayableFacet[]} facets from answers-core
 * @param {FilterOptionsConfig} config the config of the FilterOptionsConfig from answers-search-ui
 * @returns {(DisplayableFacet | FilterOptionsConfig)[]}
 */
export default function transformFacets (facets, config) {
  if(!config || !('fields' in config)) {
    return facets;
  }

  return facets.map(facet => {
    const isConfigurationForFacet = facet.fieldId in config.fields;
    if (!isConfigurationForFacet) {
      return facet;
    }
    const facetConfig = config.fields[facet.fieldId];

    let options = facet.options;

    if ('fieldLabels' in facetConfig) {
      options = facet.options.map(option => {
        const fieldLabels = facetConfig.fieldLabels;

        const displayName = (option.displayName in fieldLabels)
          ? fieldLabels[option.displayName]
          : option.displayName;

        return Object.assign({}, option, { displayName });
      })
    }

    const filterOptionsConfig = Object.entries(facetConfig).reduce((filterOptions, [option, value]) => {
      if (option !== 'fieldLabels') {
        filterOptions[option] = value;
      }
      return filterOptions;
    }, {});
    
    return Object.assign({}, facet, filterOptionsConfig, { options });
  });
}