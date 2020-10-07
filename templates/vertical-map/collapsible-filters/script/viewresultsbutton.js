ANSWERS.addComponent('ViewResultsButton', {
  container: '#js-answersViewResultsButton',
  onClick: function () {
    collapsibleFiltersInteractions.collapseFilters();
    this.setState(this.getState());
  },
  onCreate() {
    collapsibleFiltersInteractions.markAsInactive(this._container);
    collapsibleFiltersInteractions.stickify(this._container);
  },
  ...{{{ json componentSettings.ViewResultsButton }}}
});