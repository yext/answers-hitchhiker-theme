BaseGDACard = typeof (BaseGDACard) !== 'undefined' ? BaseGDACard : {};

  BaseGDACard["{{componentName}}"] = class extends ANSWERS.Component {
  constructor(config = {}, systemConfig = {}) {
    super(config, systemConfig);
    const data = config.data || {};
    this.generativeDirectAnswer = data.directAnswer || '';
    this.citations = data.citations || [];
    this.resultStatus = data.resultStatus || 'NO_ANSWER';
    this.citationsData = data.citationsData || [];
    this.searchState = data.searchState;  // e.g. SEARCH_LOADING, SEARCH_COMPLETE
  }

  /**
   * Transforms the state. The object returned from this method is the state for the component.
   * The state is passed directly to the template renderer.
   *
   * @param {Object} data
   */
  setState(data) {
    let cardData = this.dataForRender(this.searchState, this.generativeDirectAnswer, this.resultStatus, this.citationsData);
    this.validateDataForRender(cardData);
    return super.setState({
      ...cardData,
      cardName: `{{componentName}}`,
      relativePath: `{{relativePath}}`
    });
  }

  validateDataForRender(data) {
    if (!data) {
      console.error('Error: nothing returned from dataForRender');
    }
  }

  onMount() {
    const citations = this._container.querySelectorAll('.js-HitchhikerGDACard-citation');
    citations && citations.forEach(citation => this._handleCitationClickAnalytics(citation));

    const rtfElement = this._container.querySelector('.js-yxt-rtfValue');
    rtfElement && rtfElement.addEventListener('click', e => this._handleRtfClickAnalytics(e));
  }

  /**
   * A click handler for citations in a Generated Direct Answer.
   *
   * @param {HTMLElement} citationElement The citation element that was clicked.
   */
  _handleCitationClickAnalytics (citationElement) {
    const searcher = this._config.data.searcher;
    const verticalKey = this._config.data.verticalKey;
    const analyticsReporter = this.analyticsReporter;
    citationElement.addEventListener('click', function(clickEvent) {
      let target = clickEvent.target;
      const targetClassName = 'js-HitchhikerGDACard-citation';
      while (target && !target.classList.contains(targetClassName)) {
        target = target.parentElement;
      }
      if (!target) {
        console.error('No citation target found for analytics.');
        return;
      }
      const entityId = target.dataset.entityid;
      if (!entityId) {
        console.error('No entityId found for citation target.');
        return;
      }
      const eventType = target.dataset.eventtype || 'CITATION_CLICK';
      const event = new ANSWERS.AnalyticsEvent(eventType)
        .addOptions({
          generativeDirectAnswer: true,
          directAnswer: true,
          entityId,
          searcher,
          verticalConfigId: verticalKey,
        })
      analyticsReporter.report(event);
    });
  }

  /**
   * A click handler for links in a Generated Direct Answer. When such a link
   * is clicked, an {@link AnalyticsEvent} needs to be fired.
   *
   * @param {MouseEvent} event The click event.
   */
  _handleRtfClickAnalytics (event) {
    if (!event.target.dataset.ctaType) {
      return;
    }
    const ctaType = event.target.dataset.ctaType;

    const analyticsOptions = {
      generativeDirectAnswer: true,
      directAnswer: true,
      fieldName: 'gda-snippet',
      searcher: this._config.data.searcher,
      url: event.target.href,
      verticalConfigId: this._config.data.verticalKey,
    };

    const analyticsEvent = new ANSWERS.AnalyticsEvent(ctaType);
    analyticsEvent.addOptions(analyticsOptions);
    this.analyticsReporter.report(analyticsEvent);
  }

  /**
   * updateState enables for partial updates (the delta between the old and new)
   * @type {object} The new state to apply to the old
   */
  updateState (state = {}) {
    const newState = Object.assign({}, this.getState(), state);
    this.setState(newState);
  }

  /**
   * Returns an object with the default event options for the card, including
   * any event options passed in
   * @param {Object} eventOptions
   */
  addDefaultEventOptions(eventOptions = {}) {
    return Object.assign({}, {
        searcher: this._config.data.searcher,
        verticalConfigId: this._config.data.verticalKey,
        ...eventOptions
      },
    );
  }

  /**
   * Returns the type of component
   */
  static get type() {
    return `{{componentName}}`;
  }

  /**
   * Returns a boolean indicating whether there can be multiple components of this
   * type with the same name.
   */
  static areDuplicateNamesAllowed() {
    return false;
  }
}
