{{> cards/card_component componentName='product-prominentimage'}}

class product_prominentimageCardComponent extends BaseCard['product-prominentimage'] {
  constructor(config = {}, systemConfig = {}) {
    super(config, systemConfig);
    this.setTemplate(`{{{read 'cards/product-prominentimage/template' }}}`);
  }

  /**
   * This returns an object that will be called `card`
   * in the template. Put all mapping logic here.
   *
   * @param profile profile of the entity in the card
   */
  dataForRender(profile) {
    // Extract the data for the primary and secondary CTAs from the profile.
    // Apply a sane default if not present in the profile.
    const primaryCTAData = profile.c_primaryCTA || {};
    const secondaryCTAData = profile.c_secondaryCTA || {};

    return {
      title: profile.name, // The header text of the card
      url: profile.landingPageUrl, // If the card title is a clickable link, set URL here
      target: '_top', // If the title's URL should open in a new tab, etc.
      titleEventOptions: this.addDefaultEventOptions(),
      subtitle: profile.c_price ? `$${profile.c_price}` : '', // The sub-header text of the card
      image: Formatter.image(profile.c_photo).url, // The URL of the image to display on the card
      altText: Formatter.image(profile.c_photo).alternateText,  // The alternate text for the image
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
        label: secondaryCTAData.label,
        iconName: 'chevron',
        url: secondaryCTAData.url,
        target: '_top',
        eventType: 'CTA_CLICK',
        eventOptions: this.addDefaultEventOptions()
      }
    };
  }
}

ANSWERS.registerComponentType(product_prominentimageCardComponent);