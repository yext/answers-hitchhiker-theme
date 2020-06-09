BaseDirectAnswerCard = typeof (BaseDirectAnswerCard) !== 'undefined' ?
  BaseDirectAnswerCard :
  {};

BaseDirectAnswerCard['{{componentName}}'] = class extends ANSWERS.Component {
  constructor(config = {}, systemConfig = {}) {
    super(config, systemConfig);
    let data = config.data || {};
    this.associatedEntityId = data.relatedItem && data.relatedItem.data && data.relatedItem.data.id;
  }

  /**
   * Transforms the state. The object returned from this method is the state for the component.
   * The state is passed directly to the template renderer.
   *
   * @param {Object} data
   */
  setState(data) {
    let { type, answer, relatedItem } = data;
    let cardData = this.dataForRender(type, answer, relatedItem);
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