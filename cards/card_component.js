BaseCard = typeof(BaseCard) !== 'undefined' ?
  BaseCard :
  {};

BaseCard['{{componentName}}'] = class extends ANSWERS.Component {
  constructor(config = {}, systemConfig = {}) {
    super(config, systemConfig);
    const data = config.data || {};

    this.verticalKey = data.verticalKey;
    this.result = data.result || {};

    /**
     * Indicates if the excessDetailsToggle boolean has been set. This boolean
     * determines if the 'Show more', 'Show less' toggling behavior is enabled.
     */
    this.excessDetailsToggleSet = false;

    /**
     * Indicates if the hideExcessDetails boolean has been set. This boolean controls
     * whether or not the detail text over the showMoreLimit is displayed or hidden.
     */
    this.hideExcessDetailsSet = false;
  }

  /**
   * Registers a click handler to toggle between showing and hiding the excess details,
   * only if such a toggle is enabled.
   */
  onMount() {
    if (this.excessDetailsToggle) {
      const el = this._container.querySelector('.js-HitchhikerCard-details-toggle');
      el.addEventListener('click', () => {
        this.hideExcessDetails = !this.hideExcessDetails;
        this.setState();
      });
    }
  }

  setState(data) {
    const { _raw, ...derivedFields } = this.result;
    const profile = { ..._raw };
    for (const field of Object.keys(derivedFields)) {
      profile[`d_${field}`] = derivedFields[field];
    }

    let cardData = this.dataForRender(profile);
    let { details, showMoreDetails } = cardData;

    const cardDetails = details || '';
    const cardShowMoreConfig = showMoreDetails || {};
    const { showMoreLimit } = cardShowMoreConfig;
    
    // Set the value of excessDetailsToggle. Note that this needs to be done only
    // once for a card. It is not enough to have a showMoreLimit. The card's details
    // must extend past this limit as well for the toggling to be enabled.
    if (!this.excessDetailsToggleSet) {
      this.excessDetailsToggle = showMoreLimit && cardDetails.length > showMoreLimit;
      this.excessDetailsToggleSet = true;
    }

    if (this.excessDetailsToggle) {
      // setState will set hideExcessDetails initially. After that, the click handler in
      // onMount will be responsible for toggling this value.
      if (!this.hideExcessDetailsSet) {
        this.hideExcessDetails = true;
        this.hideExcessDetailsSet = true;
      }  
      const details = this.hideExcessDetails
        ? `${cardDetails.substring(0, showMoreLimit)}...`
        : cardDetails;
      cardData.details = details;
    }
    this.validateDataForRender(cardData);

    const { hideExcessDetails, excessDetailsToggle } = this;

    return super.setState({
      ...data,
      hideExcessDetails,
      card: cardData,
      excessDetailsToggle,
      cardName: `{{componentName}}`
    });
  }

  validateDataForRender(data) {
    if (!data){
      console.error('Error: nothing returned from dataForRender');
    }
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