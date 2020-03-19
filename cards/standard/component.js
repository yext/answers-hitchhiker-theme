{{> cards_card_component componentName='StandardCard'}}

class StandardCardComponent extends BaseCard.StandardCard {
  constructor(config = {}, systemConfig = {}) {
    super(config, systemConfig);
    this.setTemplate(`{{{read 'cards_standard_template' }}}`);
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
      titleUrl: profile.websites,
      subtitle: '',
      details: profile.description,
      callsToAction: [
        {
          url: profile.c_primaryCTA,
          iconName: 'chevron',
          label: 'View Details'
        }
      ]
    };
  }
}

ANSWERS.registerComponentType(StandardCardComponent);