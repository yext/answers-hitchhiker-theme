ANSWERS.addComponent('FilterLink', {
  container: '#js-answersFilterLink',
  ...{{{ json componentSettings.FilterLink }}},
  onClickResetFilters: function() {
    JsHelpers.removeAllFilterNodes();
    JsHelpers.verticalSearch({ useFacets: true });
  },
  onClickChangeFilters: () => {
    pageInteractions.expandFilters();
  },
  onClickClearSearch: () => {
    JsHelpers.clearSearch();
    pageInteractions.focusSearchBar();
  }
});