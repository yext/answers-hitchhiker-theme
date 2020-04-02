BaseCard = typeof(BaseCard) !== 'undefined' ?
  BaseCard :
  {};

BaseCard.{{componentName}} = class extends ANSWERS.Component {
  constructor(config = {}, systemConfig = {}) {
    super(config, systemConfig);
    const data = config.data || {};

    this.verticalKey = data.verticalKey;
    this.result = data.result || {};
  }

  setState(data) {
    let cardData = this.dataForRender(this.result._raw) || [];
    this.validateDataForRender(cardData);
    cardData.callsToAction = this.resolveCTAMapping(this.result._raw, ...cardData.callsToAction);

    return super.setState({
      ...data,
      card: cardData,
      cardName: `{{componentName}}`,
    });
  }

  validateDataForRender(data) {
    if (!data){
      console.error('Error: nothing returned from dataForRender');
    }

    if (data.callsToAction && !Array.isArray(data.callsToAction)){
      console.error('Error: callsToAction in dataForRender should be an Array of Objects or functions.');
    }
  }

  /**
   * Handles resolving ctas from a cta mapping which are either
   * 1. a function that returns a cta's config
   * 2. an object that has a per-attribute mapping of either a
   *    a) static value
   *    b) function that takes in resut data and returns the given attributes value
   * Note: Intentionally does not allow nesting functions.
   * @param {Object} result
   * @param {Function|...(Object|string)} ctas
   * @returns {Array<Object>}
   */
  resolveCTAMapping (result, ...ctas) {
    let parsedCTAs = [];
    ctas.map(ctaMapping => {
      if (typeof ctaMapping === 'function') {
        parsedCTAs = parsedCTAs.concat(ctaMapping(result));
      } else if (typeof ctaMapping === 'object') {
        const ctaObject = { ...ctaMapping };
        for (let [ctaAttribute, attributeMapping] of Object.entries(ctaMapping)) {
          if (typeof attributeMapping === 'function') {
            ctaObject[ctaAttribute] = attributeMapping(result);
          }
        }
        parsedCTAs.push(ctaObject);
      }
    });
    parsedCTAs = parsedCTAs.filter(cta => cta);

    let self = this;
    parsedCTAs.forEach(cta => {
      if (!cta.label && !cta.url) {
        console.warn('Call to Action:', cta, 'is missing both a label and url attribute and is being automatically hidden');
      } else if (!cta.label) {
        console.warn('Call to Action:', cta, 'is missing a label attribute and is being automatically hidden');
      } else if (!cta.url) {
        console.warn('Call to Action:', cta, 'is missing a url attribute and is being automatically hidden');
      }

      if (!cta.eventOptions) {
        cta.eventOptions =  {
          verticalKey: self.verticalKey,
          searcher: self._config.isUniversal ? "UNIVERSAL" : "VERTICAL",
          entityId: self.result.id
        }
      }
    });

    return parsedCTAs.filter(cta => cta.url && cta.url.trim() && cta.label && cta.label.trim());
  }

  static get type() {
    return `{{componentName}}`;
  }

  static areDuplicateNamesAllowed() {
    return true;
  }
}