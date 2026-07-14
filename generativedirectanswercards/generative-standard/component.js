{{> generativedirectanswercards/card_component componentName = 'generative-standard' }}

class generative_standardComponent extends BaseGDACard['generative-standard'] {
  constructor(config = {}, systemConfig = {}) {
    super(config, systemConfig);
  }

  onMount() {
    super.onMount();
    this._bindAISignpost();
  }

  /**
   * Wires up the AI signpost popover toggle behavior for the generative-standard card.
   */
  _bindAISignpost () {
    const signpost = this._container.querySelector('.HitchhikerGenerativeStandard-aiSignpost');
    const signpostButton = this._container.querySelector('.js-yxt-GenerativeDirectAnswer-aiSignpostButton');
    const signpostPopover = this._container.querySelector('.js-yxt-GenerativeDirectAnswer-aiSignpostPopover');
    const signpostCloseButton = this._container.querySelector('.js-yxt-GenerativeDirectAnswer-aiSignpostClose');
    if (!signpost || !signpostButton || !signpostPopover) {
      return;
    }

    const setIsOpen = isOpen => {
      signpostButton.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      signpostPopover.hidden = !isOpen;
    };

    signpostButton.addEventListener('click', () => {
      setIsOpen(signpostButton.getAttribute('aria-expanded') !== 'true');
    });

    signpostCloseButton && signpostCloseButton.addEventListener('click', () => setIsOpen(false));
    document.addEventListener('click', event => {
      if (!signpost.contains(event.target)) {
        setIsOpen(false);
      }
    });
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
    const linkTarget = AnswersExperience.runtimeConfig.get('linkTarget') || '_top';
    return  {
      searchState,
      generativeDirectAnswer,
      citationsData,
      success,
      sourceUrlFields,
      linkTarget,
      feedbackTextOnSubmission: 'Thank you for your feedback!',
      feedbackText: 'Was this the answer you were looking for?',
      positiveFeedbackSrText: 'This answered my question',
      negativeFeedbackSrText: 'This did not answer my question'
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
