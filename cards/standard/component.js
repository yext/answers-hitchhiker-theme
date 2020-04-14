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
      titleEventOptions: this.addDefaultEventOptions(),
      subtitle: '',
      details: profile.description,
      // newWindow: true,
      callsToAction: [
        {
          url: profile.c_primaryCTA,
          iconName: 'chevron',
          label: 'View Details',
          target: '_parent',
          modifiers: 'yxt-CTA--solo',
          eventType: 'CTA_CLICK',
        }
      ]
    };
  }
}

ANSWERS.registerComponentType(StandardCardComponent);