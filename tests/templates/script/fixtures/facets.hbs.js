ANSWERS.addComponent('Facets', {
  container: '#js-answersFacets',
  onMount: function() {
    if (typeof IS_COLLAPSIBLE_FILTERS !== 'undefined') {
      facetsDecorator.onMount(this);
    }
  },
  ...{},
});
