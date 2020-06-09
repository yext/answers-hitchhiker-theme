{{> directanswercards/card_component componentName = 'allfields-standard' }}

class allfields_standardComponent extends BaseDirectAnswerCard['allfields-standard'] {
  constructor(config = {}, systemConfig = {}) {
    super(config, systemConfig);
    this.setTemplate(`{{{read 'directanswercards/allfields-standard/template' }}}`);
  }

  /**
   * @param type the type of direct answer
   * @param answer the full answer returned from the API, corresponds to response.directAnswer.answer.
   * @param relatedItem profile of the related entity for the direct answer
   */
  dataForRender(type, answer, relatedItem) {
    // TODO
    return {};
  }
}

ANSWERS.registerComponentType(allfields_standardComponent);
