{{> cards_card_component componentName='AccordionCard'}}

class AccordionCardComponent extends BaseCard.AccordionCard {
  constructor(config = {}, systemConfig = {}) {
    super(config, systemConfig);
    this.setTemplate(`{{{read 'cards_accordion_template' }}}`);
  }

  /**
   * This returns an object that will be called `card`
   * in the template. Put all mapping logic here.
   *
   * @param profile profile of the entity in the card
   */
  dataForRender(profile) {
    return {
      title: profile.name,
      details: profile.answer,
      callsToAction: profile.c_ctas ? profile.c_ctas.map((cta) => {
        return {
          "label": cta.text,
          "url": cta.url,
          "iconName": cta.icon,
          "target": "_parent",
        };
      }) : null,
    };
  }
}

ANSWERS.registerComponentType(AccordionCardComponent);