ANSWERS.addComponent("Map", Object.assign({},
  {
    container: "#js-answersMap",
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
  },
  {{#with (lookup verticalsToConfig verticalKey)}}
    {{#if mapConfig}}
      {{{json mapConfig}}},
    {{/if}}
  {{/with}}
  {{{ json componentSettings.Map }}},
  {
    {{!-- Add theme default map pin.
          componentSettings overrides verticalsToConfig,
          if both are absent, use defaults. --}}
    pin:
      {{#if componentSettings.Map.mapProvider}}
        {{> templates/vertical-map/script/map-pin componentSettings.Map }},
      {{else}}
        {{#with (lookup verticalsToConfig verticalKey)}}
          {{#if mapConfig}}
            {{> templates/vertical-map/script/map-pin mapConfig }},
          {{/if}}
        {{/with}}
      {{/if}}
  }));