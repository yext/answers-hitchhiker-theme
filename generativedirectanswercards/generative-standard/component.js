{{> generativedirectanswercards/card_component componentName = 'generative-standard' }}

class generative_standardComponent extends BaseGDACard['generative-standard'] {
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
    return 'generativedirectanswercards/generative-standard';
  }
}

ANSWERS.registerTemplate(
  'generativedirectanswercards/generative-standard',
  {{{stringifyPartial (read 'generativedirectanswercards/generative-standard/template') }}}
);
ANSWERS.registerComponentType(generative_standardComponent);
