ANSWERS.addComponent("FilterBox", Object.assign({}, {
  container: "#js-answersFilterBox",
  {{#if verticalKey}}
    verticalKey: "{{{verticalKey}}}",
  {{/if}}
}, {{{ json componentSettings.FilterBox }}}));