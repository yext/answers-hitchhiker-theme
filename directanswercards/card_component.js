BaseDirectAnswerCard = typeof (BaseDirectAnswerCard) !== 'undefined' ?
  BaseDirectAnswerCard :
  {};

BaseDirectAnswerCard["{{componentName}}"] = class extends ANSWERS.Component {
  constructor(config = {}, systemConfig = {}) {
    super(config, systemConfig);
    const data = config.data || {};
    this.type = data.type || '';
    this.answer = data.answer || {};
    this.snippet = this.answer.snippet || {};
    this.relatedItem = data.relatedItem || {};
    this.associatedEntityId = data.relatedItem && data.relatedItem.data && data.relatedItem.data.id;
    this.verticalConfigId = data.relatedItem && data.relatedItem.verticalConfigId;
  }

  /**
   * Transforms the state. The object returned from this method is the state for the component.
   * The state is passed directly to the template renderer.
   *
   * @param {Object} data
   */
  setState(data) {
    let cardData = this.dataForRender(this.type, this.answer, this.relatedItem, this.snippet);
    this.validateDataForRender(cardData);
    return super.setState({
      ...cardData,
      feedbackEnabled: ANSWERS.getAnalyticsOptIn(),
      feedbackSubmitted: data.feedbackSubmitted,
      isArray: Array.isArray(this.answer.value),
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
    this.addFeedbackListeners();

    const rtfElement = this._container.querySelector('.js-yxt-rtfValue');
    rtfElement && rtfElement.addEventListener('click', e => this._handleRtfClickAnalytics(e));
  }

  addFeedbackListeners() {
    const feedbackFormSelector = '.js-HitchhikerDirectAnswerCard-feedbackForm';
    let feedbackFormEl = this._container.querySelector(feedbackFormSelector);
    if (feedbackFormEl) {
      // For WCAG compliance, the feedback should be a submittable form
      feedbackFormEl.addEventListener('submit', (e) => {
        const formTargetEl = e.target;
        const isGood = formTargetEl.querySelector('input:checked').value === 'true';

        this.reportQuality(isGood);
        this.updateState({
          feedbackSubmitted: true
        });
      });

      let thumbSelectorEls = this._container.querySelectorAll('.js-HitchhikerDirectAnswerCard-thumbInput');
      if (thumbSelectorEls) {
        thumbSelectorEls.forEach(el => {
          el.addEventListener('click', (e) => {
            let input = el.querySelector('input');
            if (input) {
              input.checked = true;
            }
            HitchhikerJS.DOM.triggerCustomEvent(this._container, feedbackFormSelector, 'submit');
          });
        });
      }
    }
  }

  /**
   * reportQuality will send the quality feedback to analytics
   * @param {boolean} isGood true if the answer is what you were looking for
   */
  reportQuality(isGood) {
    /**
     * EventTypes are explicit strings defined
     * for what the server expects for analytics.
     *
     * @enum
     */
    const EventTypes = {
      THUMBS_UP: 'THUMBS_UP',
      THUMBS_DOWN: 'THUMBS_DOWN'
    };
    const eventType = isGood === true ? EventTypes.THUMBS_UP : EventTypes.THUMBS_DOWN;
    const event = new ANSWERS.AnalyticsEvent(eventType)
      .addOptions({
        directAnswer: true,
        verticalKey: this.verticalConfigId,
        searcher: this._config.data.searcher,
        entityId: this.associatedEntityId
      });

    this.analyticsReporter.report(event);
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
        verticalConfigId: this.verticalConfigId,
        entityId: this.associatedEntityId,
        ...eventOptions
      },
    );
  }

  /**
   * A click handler for links in a Rich Text Direct Answer. When such a link
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
      verticalKey: this.verticalConfigId,
      directAnswer: true,
      fieldName: this.answer.fieldApiName,
      searcher: this._config.data.searcher,
      entityId: this.associatedEntityId,
      url: event.target.href
    };

    const analyticsEvent = new ANSWERS.AnalyticsEvent(ctaType);
    analyticsEvent.addOptions(analyticsOptions);
    this.analyticsReporter.report(analyticsEvent);
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
    return true;
  }
}
