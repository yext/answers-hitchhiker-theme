{{> cards/card_component componentName='StandardCard'}}

class StandardCardComponent extends BaseCard.StandardCard {
  constructor(config = {}, systemConfig = {}) {
    super(config, systemConfig);
    this.setTemplate(`{{{read 'cards/standard/template' }}}`);
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
      // image: '',
      // tagLabel: '',
      subtitle: '',
      details: profile.description,
      // newWindow: true,
      callsToAction: [
        {
          url: profile.c_primaryCTA,
          iconName: 'chevron',
          // target: '',
          // modifiers: '',
          label: 'View Details'
        }
      ]
    };
  }
}

ANSWERS.registerComponentType(StandardCardComponent);