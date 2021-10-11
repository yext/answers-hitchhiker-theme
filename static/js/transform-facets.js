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
      optionsFieldType = 'STRING',
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
      options = sortFacetOptions(options, optionsOrder, optionsFieldType, facet.fieldId);
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
 * @param {'STRING' | 'INT'} optionsFieldType 
 * @param {string} fieldId 
 * @returns {{ displayName: string }[]}
 */
function sortFacetOptions(options, optionsOrder, optionsFieldType, fieldId) {
  const getSortComparator = () => {
    if (optionsFieldType === 'STRING') {
      return (a, b) => a.displayName.localeCompare(b.displayName);
    } else if (optionsFieldType === 'INT') {
      return (a, b) => parseInt(a.displayName) - parseInt(b.displayName);
    } else {
      console.error(`Unknown facet optionsFieldType "${optionsFieldType}" for the "${fieldId}" facet.`);
      return undefined;
    }
  }
  const applyDirectionToComparator = (comparator) => {
    if (!comparator) {
      return undefined;
    }

    if (optionsOrder === 'ASC') {
      return comparator;
    } else if (optionsOrder === 'DESC') {
      return (a, b) => -1 * comparator(a, b)
    } else {
      console.error(`Unknown facet optionsOrder "${optionsOrder}" for the "${fieldId}" facet.`);
      return undefined;
    }
  }

  return [...options].sort(applyDirectionToComparator(getSortComparator()))
}


/**
 * Sorts the facet options using the priority specified in
 * the optionsOrderList and returns a new array.
 * 
 * @param {{ displayName: string }[]} options The facet options to sort.
 * @param {string[] | number[]} optionsOrderList
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