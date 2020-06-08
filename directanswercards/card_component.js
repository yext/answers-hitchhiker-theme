BaseDirectAnswerCard = typeof (BaseDirectAnswerCard) !== 'undefined' ?
  BaseDirectAnswerCard :
  {};

BaseDirectAnswerCard['{{componentName}}'] = class extends ANSWERS.Component {
  constructor(config = {}, systemConfig = {}) {
    super(config, systemConfig);
    let data = config.data || {};

    this.answer = data.answer || {};
    this.relatedItem = data.relatedItem || {};
    this.type = data.type || '';
  }

  setState(data) {
    let cardData = this.dataForRender(this.type, this.answer, this.relatedItem);
    this.validateDataForRender(cardData);

    return super.setState({
      ...cardData,
      cardName: `{{componentName}}`
    });
  }

  validateDataForRender(data) {
    if (!data) {
      console.error('Error: nothing returned from dataForRender');
    }
  }

  addDefaultEventOptions(eventOptions = {}) {
    const entityId = this.relatedItem.data && this.relatedItem.data.id ? { entityId: this.relatedItem.data.id } : {};
    return Object.assign({}, {
        searcher: "UNIVERSAL",
        ...entityId,
        ...eventOptions
      },
    );
  }

  static get type() {
    return `{{componentName}}`;
  }

  static areDuplicateNamesAllowed() {
    return true;
  }
}