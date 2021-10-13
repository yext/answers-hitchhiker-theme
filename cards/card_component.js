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
    
    let { details, showMoreDetails } = cardData;

    const cardDetails = details || '';
    const cardShowMoreConfig = showMoreDetails || {};
    const { showMoreLimit } = cardShowMoreConfig;

    // Set the value of excessDetailsToggle. Note that it is not enough to have a showMoreLimit.
    // The card's details must extend past this limit as well for the toggling to be enabled.
    const showExcessDetailsToggle = showMoreLimit && cardDetails.length > showMoreLimit;

    let truncatedDetails = showExcessDetailsToggle
      ? `${cardDetails.substring(0, showMoreLimit)}...`
      : '';
    
    this.validateDataForRender(cardData);

    return super.setState({
      ...data,
      card: cardData,
      showExcessDetailsToggle: showExcessDetailsToggle,
      truncatedDetails: truncatedDetails,
      cardName: `{{componentName}}`,
      relativePath: `{{relativePath}}`
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
