/**
 * Transforms the Facets.fields component configuration into a transformFacets function
 * which can be understood by the Answers Search UI.
 * 
 * @param {DisplayableFacet[]} facets from answers-core
 * @param {FilterOptionsConfig} config the config of the FilterOptionsConfig from answers-search-ui
 * @returns {(DisplayableFacet | FilterOptionsConfig)[]}
 */
export default function transformFacets(facets, config) {
  if (!config || !('fields' in config)) {
    return facets;
  }

  return facets.map(facet => {
    const hasConfigurationForFacet = facet.fieldId in config.fields;
    if (!hasConfigurationForFacet) {
      return facet;
    }

    if (typeof config.fields[facet.fieldId] !== 'object') {
      console.error(
        `The "fields" config for ${facet.fieldId} should be an object. ` +
        `Received ${config.fields[facet.fieldId]} instead.`);
    }

    const {
      fieldLabels,
      optionsOrder,
      optionsOrderList,
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

    if (optionsOrderList) {
      options = sortFacetOptionsCustom(options, optionsOrderList);
    } else if (optionsOrder) {
      options = sortFacetOptions(options, optionsOrder, facet.fieldId);
    }

    return {
      ...facet,
      ...filterOptionsConfig,
      options
    };
  });
}

/**
 * Sorts the facet options and returns a new array.
 * 
 * @param {{ displayName: string }[]} options The facet options to sort.
 * @param {'ASC' | 'DESC'} optionsOrder 
 * @param {string} fieldId 
 * @returns {{ displayName: string }[]}
 */
function sortFacetOptions(options, optionsOrder, fieldId) {
  const getSortComparator = () => {
    if (optionsOrder === 'ASC') {
      return (a, b) => a.displayName.localeCompare(b.displayName);
    } else if (optionsOrder === 'DESC') {
      return (a, b) => b.displayName.localeCompare(a.displayName);
    } else {
      console.error(`Unknown facet optionsOrder "${optionsOrder}" for the "${fieldId}" facet.`);
      return undefined;
    }
  }
  const comparator = getSortComparator();
  if (!comparator) {
    return options;
  }
  return [...options].sort(comparator);
}


/**
 * Sorts the facet options using the priority specified in
 * the optionsOrderList and returns a new array.
 * 
 * @param {{ displayName: string }[]} options The facet options to sort.
 * @param {string[]} optionsOrderList
 * @returns {{ displayName: string }[]}
 */
function sortFacetOptionsCustom(options, optionsOrderList) {
  const getPriority = displayName => {
    const index = optionsOrderList.indexOf(displayName);
    return index === -1 ? optionsOrderList.length : index;
  }

  return [...options].sort((a, b) => {
    return getPriority(a.displayName) - getPriority(b.displayName);
  });
}