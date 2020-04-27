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
    const { _raw, ...derivedFields } = this.result;
    const profile = { ..._raw };
    for (const field of Object.keys(derivedFields)) {
      profile[`d_${field}`] = derivedFields[field];
    }
    let cardData = this.dataForRender(profile);
    this.validateDataForRender(cardData);
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