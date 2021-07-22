ANSWERS.addComponent('Facets', {
  container: '#js-answersFacets',
    verticalKey: "testKey",
  onMount: function() {
    if (typeof IS_COLLAPSIBLE_FILTERS !== 'undefined') {
      facetsDecorator.onMount(this);
    }
  },
  ...{"a":"testF"},
});
