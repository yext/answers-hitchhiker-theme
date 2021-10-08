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
    const hasConfigurationForFacet = facet.fieldId in config.fields;
    if (!hasConfigurationForFacet) {
      return facet;
    }
    const {
      fieldLabels,
      optionsOrder,
      ...filterOptionsConfig
    } = config.fields[facet.fieldId];

    let options = facet.options;

    if (fieldLabels) {
      options = facet.options.map(option => {
        const displayName = (option.displayName in fieldLabels)
          ? fieldLabels[option.displayName]
          : option.displayName;
        return { ...option, displayName };
      })
    }

    if (optionsOrder) {
      if (optionsOrder === 'ASC') {
        options = options.sort((a, b) =>  a.displayName.toString().localeCompare(b.displayName.toString()));
      } else if (optionsOrder === 'DESC') {
        options = options.sort((a, b) =>  b.displayName.toString().localeCompare(a.displayName.toString()));
      } else {
        console.error(`Unknown facet optionsOrder "${optionsOrder}" for the "${facet.fieldId}" facet.`);
      }
    }
    
    return {
      ...facet,
      ...filterOptionsConfig,
      options
    };
  });
}
