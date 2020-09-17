ANSWERS.addComponent("SearchBar", {
  container: "#js-answersSearchBar",
  {{#if verticalKey}}
    verticalKey: "{{{verticalKey}}}",
  {{/if}}
  ...{{{ json componentSettings.SearchBar }}}
});
