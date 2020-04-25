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
      title: profile.name, // The header text of the card
      titleUrl: profile.websites, // If the card title is a clickable link, set URL here
      // target: '', // If the title's URL should open in a new tab, etc.
      // image: '', // The URL of the image to display on the card
      // tagLabel: '', // The label of the displayed image
      titleEventOptions: this.addDefaultEventOptions(),
      subtitle: '', // The sub-header text of the card
      details: profile.description, // The text in the body of the card
      // The calls to action on the card
      callsToAction: [
        {
          url: profile.websites, // The URL a user will be directed to when clicking
          iconName: 'chevron', // The icon to use for the CTA
          label: 'View Details', // The label of the CTA
          target: '_parent', // If the URL will be opened in a new tab, etc.
          modifiers: 'yxt-CTA--solo', // Additional CSS classes for the CTA
          eventType: 'CTA_CLICK', // Type of Analytics event fired when clicking the CTA
        }
      ]
    };
  }
}

ANSWERS.registerComponentType(StandardCardComponent);