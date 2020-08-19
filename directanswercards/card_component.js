BaseDirectAnswerCard = typeof (BaseDirectAnswerCard) !== 'undefined' ?
  BaseDirectAnswerCard :
  {};

BaseDirectAnswerCard["{{componentName}}"] = class extends ANSWERS.Component {
  constructor(config = {}, systemConfig = {}) {
    super(config, systemConfig);
    let data = config.data || {};
    this.type = data.type || '';
    this.answer = data.answer || {};
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
    let cardData = this.dataForRender(this.type, this.answer, this.relatedItem);
    this.validateDataForRender(cardData);

    return super.setState({
      ...cardData,
      feedbackSubmitted: data.feedbackSubmitted,
      isArray: Array.isArray(this.answer.value),
      cardName: `{{componentName}}`
    });
  }

  validateDataForRender(data) {
    if (!data) {
      console.error('Error: nothing returned from dataForRender');
    }
  }

  onMount() {
    let feedbackFormSelector = '.js-HitchhikerDirectAnswerCard-feedbackForm';
    let feedbackFormEl = this._container.querySelector(feedbackFormSelector);
    if (feedbackFormEl) {
      // For WCAG compliance, the feedback should be a submittable form
      feedbackFormEl.addEventListener('submit', (e) => {
        let formTargetEl = e.target;
        let checkedValue = formTargetEl.querySelector('input:checked').value === 'true';

        this.reportQuality(checkedValue);
        this.updateState({
          'feedbackSubmitted': true
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
            this._triggerCustomEvent(feedbackFormSelector, 'submit');
          });
        });
      }
    }
  }

  /**
   * Triggers the event passed in dispatched from the given selector
   * @param {string} selector selector to dispatch event from
   * @param {string} event event to fire
   * @param {Object} settings additional settings
   */
  _triggerCustomEvent(selector, event, settings) {
    let e = this._customEvent(event, settings);
    this._container.querySelector(selector).dispatchEvent(e);
  }

  /**
   * _customEvent is an event constructor polyfill
   * @param {string} event event to fire
   * @param {Object} settings additional settings
   */
  _customEvent(event, settings) {
    const _settings = {
      bubbles: true,
      cancelable: true,
      detail: null,
      ...settings
    };
    const evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(event, _settings.bubbles, _settings.cancelable, _settings.detail);
    return evt;
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
        'directAnswer': true
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
        searcher: "UNIVERSAL",
        verticalConfigId: this.verticalConfigId,
        entityId: this.associatedEntityId,
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
    return true;
  }
}