ANSWERS.addComponent("VerticalResults", Object.assign({}, {
  container: "#js-answersVerticalResults",
  {{#if verticalKey}}
    verticalKey: "{{{verticalKey}}}",
    modifier: "{{{verticalKey}}}",
  {{/if}}
  verticalPages: [
    {{#each verticalConfigs}}
      {{#if verticalKey}}
      {
        verticalKey: "{{{verticalKey}}}",
        {{#each ../excludedVerticals}}{{#ifeq this ../verticalKey}}hideInNavigation: true,{{/ifeq}}{{/each}}
        {{#ifeq ../verticalKey verticalKey}}isActive: true,{{/ifeq}}
        {{#with (lookup verticalsToConfig verticalKey)}}
        {{#if isFirst}}isFirst: {{isFirst}},{{/if}}
        {{#if icon}}icon: "{{{icon}}}",{{/if}}
        {{#if iconUrl}}iconUrl: "{{{iconUrl}}}",{{/if}}
        label:
        {{#if label}}"{{{label}}}"{{else}}{{#if ../verticalKey}}"{{{../verticalKey}}}"{{else}}"{{{@key}}}"{{/if}}{{/if}},
        url: "{{#if url}}{{{url}}}{{else if ../url}}{{../../relativePath}}/{{{../url}}}{{else}}{{{@key}}}.html{{/if}}",
        {{/with}}
      }{{#unless @last}},{{/unless}}
      {{else}}
      {
      {{#with (lookup verticalsToConfig "Universal")}}
        {{#if isFirst}}isFirst: {{isFirst}},{{/if}}
        {{#if icon}}icon: "{{{icon}}}",{{/if}}
        label: {{#if label}}"{{{label}}}"{{else}}"{{{@key}}}"{{/if}},
        url: "{{#if url}}{{{url}}}{{else if ../url}}{{../../relativePath}}/{{{../url}}}{{else}}{{{@key}}}.html{{/if}}",
      {{/with}}
      }{{#unless @last}},{{/unless}}
      {{/if}}
    {{/each}}
  ],
  {{#with (lookup verticalsToConfig verticalKey)}}
    card: {
      {{#if cardType}}cardType: "{{{cardType}}}",{{/if}}
    },
  {{/with}}
  {{!-- used to hide the default results header --}}
  hideResultsHeader: true
}, {{{ json componentSettings.VerticalResults }}}));