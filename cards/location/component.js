{{> cards/card_component componentName='LocationCard'}}

class LocationCardComponent extends BaseCard.LocationCard {
  constructor(config = {}, systemConfig = {}) {
    super(config, systemConfig);
    this.setTemplate(`{{{read 'cards/location/template' }}}`);
  }

  /**
   * This returns an object that will be called `card`
   * in the template. Put all mapping logic here.
   *
   * @param {Object} profile of the entity in the card
   */
  dataForRender(profile) {
    return {
      title: profile.name, // The header text of the card
      titleUrl: profile.websites, // If the card title is a clickable link, set URL here
      // target: '', // If the title's URL should open in a new tab, etc.
      // image: '', // The URL of the image to display on the card
      // tagLabel: '', // The label of the displayed image
      titleEventOptions: this.addDefaultEventOptions(), // The event options for title click analytics
      subtitle: '', // The sub-header text of the card
      address: profile.address, // The address for the card
      phone: profile.mainPhone, // The phone number for the card
      details: profile.description, // The description for the card, displays below the address and phone
      // The calls to action on the card
      callsToAction: [
        {
          url: HitchhikerJS.Formatters.phoneLink(profile), // The URL a user will be directed to when clicking
          iconName: 'phone', // The icon to use for the CTA
          label: 'Call', // The label of the CTA
          target: '_parent', // If the URL will be opened in a new tab, etc.
          // modifiers: '', // Additional CSS classes for the CTA
          eventType: 'TAP_TO_CALL', // Type of Analytics event fired when clicking the CTA
        },
        {
          url: HitchhikerJS.Formatters.getDirectionsUrl(profile),
          label: 'Get Directions',
          iconName: 'directions',
          eventType: 'DRIVING_DIRECTIONS',
        }
      ]
    };
  }
}

ANSWERS.registerComponentType(LocationCardComponent);
