ANSWERS.addComponent('AppliedFilters', {
  container: '#js-answersAppliedFilters',
  {{#if verticalKey}}
    verticalKey: '{{{verticalKey}}}',
  {{/if}}
  ...{{{ json componentSettings.VerticalResults.appliedFilters }}},
  ...{{{ json componentSettings.AppliedFilters }}},
  onCreate: function () {
    ANSWERS.core.globalStorage.on('update', 'facets-on-mount', () => this.setState());
  },
  onMount: function () {
    const neededMarginTop = document.getElementById('js-header').getBoundingClientRect().height;
    document.getElementById('js-resultsColumn').style.marginTop = `${neededMarginTop}px`;
  }
});