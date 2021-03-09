ANSWERS.registerTemplate('theme-components/interactive-map', '');
ANSWERS.registerComponentType(window.InteractiveMap);
ANSWERS.addComponent('InteractiveMap', Object.assign({},
{
  container: '.js-answersInteractiveMap',
  apiKey: HitchhikerJS.getDefaultMapApiKey(
    {{#if componentSettings.Map.mapProvider}}
      "{{componentSettings.Map.mapProvider}}"
    {{else}}
      {{#with (lookup verticalsToConfig verticalKey)}}
        {{#if mapConfig}}
          "{{mapConfig.mapProvider}}"
        {{/if}}
      {{/with}}
    {{/if}}
  ),
  pageSettings: {{{ json pageSettings }}},
  onPinSelect: () => {
    window.collapsibleFiltersInteractions && window.collapsibleFiltersInteractions.collapseFilters();
  },
  locale: "{{global_config.locale}}",
  verticalKey: "{{{verticalKey}}}",
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
        {{#if iconUrl}}iconUrl: "{{#unless (isNonRelativeUrl iconUrl)}}{{relativePath}}/{{/unless}}{{{iconUrl}}}",{{/if}}
        label: "{{> verticalLabel overridedLabel=label verticalKey=../verticalKey fallback=@key}}",
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
  searchbarConfig: Object.assign({}, 
    {
      container: ".js-answersSearch",
      {{#if verticalKey}}
        verticalKey: "{{{verticalKey}}}",
      {{/if}}
    },
    {{{ json componentSettings.SearchBar }}},
  ),
},
  {{#with (lookup verticalsToConfig verticalKey)}}
    {{#if mapConfig}}
      {{{json mapConfig}}},
    {{/if}}
  {{/with}}
  {{{ json componentSettings.InteractiveMap }}},
));

{{!--
  Prints the vertical label according to specific logic
  Assumes @root has environment variables and global_config
  @param overridedLabel The hardcoded label from configuration in repo, meant to supercede defaults
  @param verticalKey The current vertical key, if it exists
  @param fallback The fallback for the label if all else doesn't exist
--}}
{{#*inline 'verticalLabel'}}
  {{~#if overridedLabel ~}}
    {{{overridedLabel}}}
  {{~ else if
    (lookup
      (lookup 
        (lookup 
          (lookup
            @root.env.JAMBO_INJECTED_DATA.answers.experiences
            @root.global_config.experienceKey)
          'verticals')
        verticalKey)
      'displayName')
  ~}}
    {{{lookup
      (lookup 
        (lookup 
          (lookup
            @root.env.JAMBO_INJECTED_DATA.answers.experiences
            @root.global_config.experienceKey)
          'verticals')
        verticalKey)
      'displayName'}}}
  {{~ else if verticalKey ~}}
    {{{verticalKey}}}
  {{~ else ~}}
    {{{fallback}}}
  {{~/if ~}}
{{/inline}}
