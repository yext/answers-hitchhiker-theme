BaseCard = typeof(BaseCard) !== 'undefined' ?
  BaseCard :
  {};

BaseCard["{{componentName}}"] = class extends ANSWERS.Component {
  constructor(config = {}, systemConfig = {}) {
    super(config, systemConfig);
    const data = config.data || {};

    this.verticalKey = data.verticalKey;
    this.result = data.result || {};
  }

  /**
   * Registers a click handler to toggle between showing and hiding the excess details,
   * only if such a toggle is present in the DOM.
   */
  onMount() {
    //polyfill for image styling (object-fit) in ie11
    const images = document.querySelectorAll('.HitchhikerProductProminentImage-img');
    HitchhikerJS.objectFitImages(images);

    const showExcessDetailsToggleEls = this._container.querySelectorAll('.js-HitchhikerCard-detailsToggle');
    const excessDetailsEls = this._container.querySelectorAll('.js-HitchhikerCard-detailsText');
    if (showExcessDetailsToggleEls && excessDetailsEls) {
      showExcessDetailsToggleEls.forEach(el =>
        el.addEventListener('click', () => {
          showExcessDetailsToggleEls.forEach(toggleEl => toggleEl.classList.toggle('js-hidden'));
          excessDetailsEls.forEach(detailsEl => detailsEl.classList.toggle('js-hidden'));
        })
      );
    }

    this.addFeedbackListeners();
  }

  addFeedbackListeners() {
    const feedbackFormSelector = '.js-HitchhikerCard-feedbackForm';
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

      let thumbSelectorEls = this._container.querySelectorAll('.js-HitchhikerCard-thumbInput');
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

  setState(data) {
    const { _raw, ...derivedFields } = this.result;
    const profile = { ..._raw };
    for (const field of Object.keys(derivedFields)) {
      profile[`d_${field}`] = derivedFields[field];
    }

    let cardData = this.dataForRender(profile);
    if (cardData.url && cardData.titleEventOptions) {
      const { url, titleEventOptions } = cardData;
      const updatedEventOptions = Object.assign({}, titleEventOptions, { url });
      cardData.titleEventOptions = updatedEventOptions;
    }
    
    cardData.feedbackEnabled = ANSWERS.getAnalyticsOptIn() && cardData.feedback;

    const { showExcessDetailsToggle, truncatedDetails } =
      this._getTruncatedDetails(cardData.details, cardData.showMoreDetails);
    
    this.validateDataForRender(cardData);

    return super.setState({
      ...data,
      card: cardData,
      showExcessDetailsToggle,
      truncatedDetails,
      cardName: `{{componentName}}`,
      relativePath: `{{relativePath}}`
    });
  }

  /**
   * Returns whether to render the excess details toggle, and
   * if so, the truncated details text.
   * 
   * @param {string} details 
   * @param {Object} showMoreDetails
   * @param {number} showMoreDetails.showMoreLimit
   * @param {string} showMoreDetails.truncatedDetails
   */
  _getTruncatedDetails(details = '', showMoreDetails = {}) {
    const { showMoreLimit, truncatedDetails: userSpecifiedTruncatedDetails } = showMoreDetails;

    if (userSpecifiedTruncatedDetails) {
      const showExcessDetailsToggle = userSpecifiedTruncatedDetails.length < details.length
      const truncatedDetails = showExcessDetailsToggle ? userSpecifiedTruncatedDetails : '';
      return {
        showExcessDetailsToggle,
        truncatedDetails
      }
    }

    const suffix = '...';

    // Set the value of excessDetailsToggle. Note that it is not enough to have a showMoreLimit.
    // The card's details must extend past this limit as well for the toggling to be enabled.
    const showExcessDetailsToggle = showMoreLimit && (details.length + suffix.length > showMoreLimit);
    
    const truncatedDetails = showExcessDetailsToggle
      ? details.substring(0, showMoreLimit) + suffix
      : '';
    return {
      showExcessDetailsToggle,
      truncatedDetails
    };
  }

  validateDataForRender(data) {
    if (!data){
      console.error('Error: nothing returned from dataForRender');
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
        directAnswer: false,
        verticalKey: this.verticalKey,
        searcher: this._config.isUniversal ? 'UNIVERSAL' : 'VERTICAL',
        entityId: this.result.id
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

  addDefaultEventOptions(eventOptions = {}) {
    return Object.assign({}, {
        verticalKey: this.verticalKey,
        searcher: this._config.isUniversal ? "UNIVERSAL" : "VERTICAL",
        entityId: this.result.id
      },
      eventOptions
    );
  }

  static get type() {
    return `{{componentName}}`;
  }

  static areDuplicateNamesAllowed() {
    return true;
  }
}
