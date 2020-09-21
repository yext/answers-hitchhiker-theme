{{> collapsible-filters/js-helpers}}
{{> collapsible-filters/components }}

function hideFiltersOnSearchbarSearch () {
  let pendingQueryUpdate = false;

  ANSWERS.core.globalStorage.on('update', 'query', () => {
    pendingQueryUpdate = true;
  });
  
  ANSWERS.core.globalStorage.on('update', 'vertical-results', verticalResults => {
    if (verticalResults.searchState !== 'search-complete' || !pendingQueryUpdate) {
      return;
    }
    hideFilters();
    pendingQueryUpdate = false;
  });
}

hideFiltersOnSearchbarSearch();

const ComponentManagers = {};
const IS_COLLAPSIBLE_FILTERS = true;
{{> collapsible-filters/facets-manager}}
