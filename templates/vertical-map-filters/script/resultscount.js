ANSWERS.addComponent('ResultsCount', {
  container: '#js-answersResultsCount',
  {{#if verticalKey}}
    verticalKey: '{{{verticalKey}}}',
  {{/if}}
  ...{{{ json componentSettings.VerticalResults.appliedFilters }}},
  ...{{{ json componentSettings.ResultsCount }}},
  onCreate: function () {
    ANSWERS.core.globalStorage.on('update', 'facets-on-mount', () => this.setState());
  },
  onMount: function () {
    if (isNoResults()) {
      this._container.style.display = 'none';
    } else {
      this._container.style.display = '';
    }
  }
});