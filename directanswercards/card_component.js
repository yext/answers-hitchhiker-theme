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
    this.associatedEntityId = data.relatedItem && data.relatedItem.data && data.relatedItem.data.id;
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
      cardName: `{{componentName}}`
    });
  }

  validateDataForRender(data) {
    if (!data) {
      console.error('Error: nothing returned from dataForRender');
    }
  }


  /**
   * Returns an object with the default event options for the card, including
   * any event options passed in
   * @param {Object} eventOptions
   */
  addDefaultEventOptions(eventOptions = {}) {
    let entityId = this.associatedEntityId ? { entityId: this.associatedEntityId } : {};
    return Object.assign({}, {
        searcher: "UNIVERSAL",
        ...entityId,
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