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