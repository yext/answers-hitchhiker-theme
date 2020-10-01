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


ANSWERS.addComponent('ViewResultsButton', {
  container: '#js-answersViewResultsButton',
  ...{{{ json componentSettings.ViewResultsButton }}},
  onClick: function () {
    pageInteractions.collapseFilters();
    this.setState(this.getState());
  },
  onCreate() {
    pageInteractions.markAsInactive(this._container);
  }
});