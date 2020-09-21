{{> collapsible-filters/js-helpers}}
{{> collapsible-filters/apply-filters-button/component}}
{{> collapsible-filters/filter-panel-toggle/component}}

/**
 * Register event listeners that will hide the filters after a search
 * made by the searchbar is completed.
 */
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
const IS_MOBILE = isMobile();

{{> collapsible-filters/facets-manager}}
ComponentManagers.Facets = new FacetsManager();
