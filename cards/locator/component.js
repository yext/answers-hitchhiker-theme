{{> cards_card_component componentName = 'LocatorCard' }}

class LocatorCardComponent extends BaseCard.LocatorCard {
  /**
   * This returns an object that will be called `card`
   * in the template. Put all mapping logic here.
   *
   * @param profile profile of the entity in the card
   */
  dataForRender(profile) {
    return {
      image: profile.headshot ? profile.headshot.url : '',
      title: profile.name,
      titleUrl: profile.websites,
      subtitle: '',
      address: profile.address,
      phone: profile.mainPhone,
      description: profile.description,
      callsToAction: [
        {
          label: 'Call',
          iconName: 'phone',
          eventType: 'TAP_TO_CALL',
          url: HitchHikerJS.Formatters.phoneLink(profile)
        },
        {
          label: 'Get Directions',
          iconName: 'directions',
          eventType: 'DRIVING_DIRECTIONS',
          url: HitchHikerJS.Formatters.getDirectionsUrl(profile)
        }
      ]
    };
  }

  constructor(config = {}, systemConfig = {}) {
    super(config, systemConfig);
    this.setTemplate(`{{{read 'cards_locator_template' }}}`);
  }
}

ANSWERS.registerComponentType(LocatorCardComponent);