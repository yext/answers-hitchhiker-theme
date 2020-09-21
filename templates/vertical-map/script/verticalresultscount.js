ANSWERS.addComponent('VerticalResultsCount', {
  container: '#js-answersVerticalResultsCount',
  {{#if verticalKey}}
    verticalKey: '{{{verticalKey}}}',
  {{/if}}
  ...{{{ json componentSettings.VerticalResults.appliedFilters }}},
  ...{{{ json componentSettings.VerticalResultsCount }}},
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