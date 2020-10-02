ANSWERS.addComponent('FilterLink', {
  container: '#js-answersFilterLink',
  onClickResetFilters: function() {
    CollapsibleFilters.Helpers.removeAllFilterNodes();
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