ANSWERS.addComponent("Facets", Object.assign({}, {
  container: "#js-answersFacets",
  {{#if verticalKey}}
    verticalKey: "{{{verticalKey}}}",
  {{/if}}
}, {{{ json componentSettings.Facets }}}));