{{> cards/card_component componentName='standard'}}

class standardCardComponent extends BaseCard['standard'] {
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
<<<<<<< HEAD
    // Extract the data for the primary and secondary CTAs from the profile.
    // Apply a sane default if not present in the profile.
    const primaryCTAData = profile.c_primaryCTA || {};
    const secondaryCTAData = profile.c_secondaryCTA || {};

=======
>>>>>>> af5f195b27cd824a48761893662ab7271459f3af
    return {
      title: profile.name, // The header text of the card
      url: profile.website || profile.landingPageUrl, // If the card title is a clickable link, set URL here
      target: '_top', // If the title's URL should open in a new tab, etc.
      // image: '', // The URL of the image to display on the card
      // altText: '', // The alternate text for the image
      titleEventOptions: this.addDefaultEventOptions(),
      // subtitle: '', // The sub-header text of the card
      details: profile.description, // The text in the body of the card
      // If the card's details are longer than a certain character count, you can truncate the
      // text. A toggle will be supplied that can show or hide the truncated text.
      showMoreDetails: {
        showMoreLimit: 750, // Character count limit
        showMoreText: 'Show more', // Label when toggle will show truncated text
        showLessText: 'Show less' // Label when toggle will hide truncated text
      },
      // The primary CTA of the card
      CTA1: {
<<<<<<< HEAD
        label: primaryCTAData.label, // The CTA's label
        iconName: 'chevron', // The icon to use for the CTA
        url: primaryCTAData.url, // The URL a user will be directed to when clicking
=======
        label: profile.c_primaryCTA ? profile.c_primaryCTA.label : null, // The CTA's label
        iconName: 'chevron', // The icon to use for the CTA
        url: Formatter.generateCTAFieldTypeLink(profile.c_primaryCTA), // The URL a user will be directed to when clicking
>>>>>>> af5f195b27cd824a48761893662ab7271459f3af
        target: '_top', // Where the new URL will be opened
        eventType: 'CTA_CLICK', // Type of Analytics event fired when clicking the CTA
        eventOptions: this.addDefaultEventOptions()
      },
      // The secondary CTA of the card
      CTA2: {
<<<<<<< HEAD
        label: secondaryCTAData.label,
        iconName: 'chevron',
        url: secondaryCTAData.url,
=======
        label: profile.c_secondaryCTA ? profile.c_secondaryCTA.label : null,
        iconName: 'chevron',
        url: Formatter.generateCTAFieldTypeLink(profile.c_secondaryCTA),
>>>>>>> af5f195b27cd824a48761893662ab7271459f3af
        target: '_top',
        eventType: 'CTA_CLICK',
        eventOptions: this.addDefaultEventOptions()
      }
    };
  }
}

<<<<<<< HEAD
ANSWERS.registerComponentType(standardCardComponent);
=======
ANSWERS.registerComponentType(standardCardComponent);
>>>>>>> af5f195b27cd824a48761893662ab7271459f3af
