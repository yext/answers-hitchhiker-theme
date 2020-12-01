ANSWERS.addComponent('ViewResultsButton', {
  container: '#js-answersViewResultsButton',
  onClick: function () {
    collapsibleFiltersInteractions.collapseFilters();
    this.setState(this.getState());
  },
  onCreate: function () {
    collapsibleFiltersInteractions.markAsInactive(this._container);
  },
  ...{{{ json componentSettings.ViewResultsButton }}}
});