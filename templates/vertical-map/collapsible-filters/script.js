ANSWERS.addComponent('FilterPanelToggle', {
  container: '#js-answersFilterPanelToggle',
  ...{{{ json componentSettings.FilterPanelToggle }}},
  onClickResetFilters: function() {
    JsHelpers.removeAllFilterNodes();
    JsHelpers.verticalSearch({ useFacets: true });
  },
  onClickChangeFilters: () => {
    pageInteractions.showFilters();
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
    pageInteractions.hideFilters();
    this.setState(this.getState());
  },
  onCreate() {
    pageInteractions.markAsInactive(this._container);
  }
});