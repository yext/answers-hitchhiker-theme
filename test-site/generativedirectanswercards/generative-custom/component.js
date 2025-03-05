{{> generativedirectanswercards/card_component componentName = 'generative-custom' }}

class generative_customComponent extends BaseGDACard['generative-custom'] {
  constructor(config = {}, systemConfig = {}) {
    super(config, systemConfig);
  }

  /**
   * @param searchState the state of the search, e.g. SEARCH_LOADING, SEARCH_COMPLETE
   * @param generativeDirectAnswer the answer returned from the API, if any
   * @param resultStatus status of the answer, e.g. 'SUCCESS', 'NO_ANSWER'
   * @param citationsData necessary results data for displaying and linking citations
   * @param sourceUrlFields the field(s) holding the URL for the redirect link of the citations
   */
  dataForRender(searchState, generativeDirectAnswer, resultStatus, citationsData, sourceUrlFields) {
    const success = resultStatus === 'SUCCESS';
    return {
      searchState,
      generativeDirectAnswer,
      citationsData,
      success,
      sourceUrlFields
    }
  }

  /**
   * The template to render
   * @returns {string}
   * @override
   */
  static defaultTemplateName (config) {
    return 'generativedirectanswercards/generative-custom';
  }
}

ANSWERS.registerTemplate(
  'generativedirectanswercards/generative-custom',
  {{{stringifyPartial (read 'generativedirectanswercards/generative-custom/template') }}}
);
ANSWERS.registerComponentType(generative_customComponent);
