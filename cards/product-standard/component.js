{{> cards/card_component componentName='product-standard'}}

class product_standardCardComponent extends BaseCard['product-standard'] {
  constructor(config = {}, systemConfig = {}) {
    super(config, systemConfig);
    this.setTemplate(`{{{read 'cards/product-standard/template' }}}`);
  }

  /**
   * This returns an object that will be called `card`
   * in the template. Put all mapping logic here.
   *
   * @param profile profile of the entity in the card
   */
  dataForRender(profile) {
    const primaryCTAData = profile.c_primaryCTA || {};
    const secondaryCTAData = profile.c_secondaryCTA || {};
    let price = '';
    if (profile.c_price) {
      price = `$${profile.c_price}`;
    }

    return {
      title: profile.name, // The header text of the card
      url: profile.landingPageUrl, // If the card title is a clickable link, set URL here
      target: '_top', // If the title's URL should open in a new tab, etc.
      image: Formatter.image(profile.c_photo).url, // The URL of the image to display on the card
      altText: Formatter.image(profile.c_photo).altText, // The alt text of the image to display on the card
      titleEventOptions: this.addDefaultEventOptions(),
      subtitle: price, // The sub-header text of the card
      details: profile.description, // The text in the body of the card
      // If the card's details are longer than a certain character count, you can truncate the
      // text. A toggle will be supplied that can show or hide the truncated text.
      showMoreDetails: {
        showMoreLimit: 350, // Character count limit
        showMoreText: 'Show more', // Label when toggle will show truncated text
        showLessText: 'Show less' // Label when toggle will hide truncated text
      },
      // The primary CTA of the card
      CTA1: {
        label: primaryCTAData.label, // The CTA's label
        iconName: 'chevron', // The icon to use for the CTA
        url: primaryCTAData.url, // The URL a user will be directed to when clicking
        target: '_top', // Where the new URL will be opened
        eventType: 'CTA_CLICK', // Type of Analytics event fired when clicking the CTA
        eventOptions: this.addDefaultEventOptions()
      },
      // The secondary CTA of the card
      CTA2: {
        label: secondaryCTAData.label, // The CTA's label
        iconName: 'chevron', // The icon to use for the CTA
        url: secondaryCTAData.url, // The URL a user will be directed to when clicking
        target: '_top', // Where the new URL will be opened
        eventType: 'CTA_CLICK', // Type of Analytics event fired when clicking the CTA
        eventOptions: this.addDefaultEventOptions()
      },
    };
  }
}

ANSWERS.registerComponentType(product_standardCardComponent);
