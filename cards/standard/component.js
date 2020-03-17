{{> cards_card_component componentName='StandardCardComponent'}}

class StandardCardComponent extends BaseCard.StandardCardComponent {
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
      title: profile.name.toUpperCase(),
      titleUrl: profile.websites,
      newWindow: true,
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