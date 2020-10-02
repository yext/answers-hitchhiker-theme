const { CollapsibleFilters } = require("../../../../static/entry");

ANSWERS.addComponent('FilterLink', {
  container: '#js-answersFilterLink',
  onClickResetFilters: function() {
    CollapsibleFilters.Helpers.resetAllFilters();
    CollapsibleFilters.Helpers.verticalSearch({ useFacets: true });
  },
  onClickChangeFilters: () => {
    collapsibleFiltersInteractions.expandFilters();
  },
  onClickClearSearch: () => {
    CollapsibleFilters.Helpers.clearSearch();
    collapsibleFiltersInteractions.focusSearchBar();
  },
  ...{{{ json componentSettings.FilterLink }}}
});