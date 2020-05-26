{{> cards/card_component componentName='professional-location'}}

class professional_locationCardComponent extends BaseCard['professional-location'] {
  constructor(config = {}, systemConfig = {}) {
    super(config, systemConfig);
    this.setTemplate(`{{{read 'cards/professional-location/template' }}}`);
  }

  /**
   * This returns an object that will be called `card`
   * in the template. Put all mapping logic here.
   *
   * @param profile profile of the entity in the card
   */
  dataForRender(profile) {
    return {
      showOrdinal: true, // Whether to display the corresponding map pin number on the card
      title: `${profile.firstName} ${profile.lastName}`, // The header text of the card
      // subtitle: '', // The sub-header text of the card
      url: profile.website || profile.landingPageUrl, // If the card title is a clickable link, set URL here
      target: '_top', // If the title's URL should open in a new tab, etc.
      titleEventOptions: this.addDefaultEventOptions(),
      details: profile.description, // The text in the body of the card
      // listTitle: '', // Heading of the bulleted list
      // listItems: [], // Content of the bulleted list
      phone: Formatter.nationalizedPhoneDisplay(profile, 'mainPhone'), // The phone number to display
      phoneEventOptions: this.addDefaultEventOptions(), // The analytics event options for phone clicks
      image: Formatter.image(profile.headshot).url, // The URL of the image to display on the card
      altText: Formatter.image(profile.headshot).alternateText, // The alternate text for the image

      // If the card's details are longer than a certain character count, you can truncate the
      // text. A toggle will be supplied that can show or hide the truncated text.
      showMoreDetails: {
        showMoreLimit: 500, // Character count limit
        showMoreText: 'Show more', // Label when toggle will show truncated text
        showLessText: 'Show less' // Label when toggle will hide truncated text
      },
      // Distance from the user’s or inputted location
      distance: Formatter.toMiles(profile),
      // The primary CTA of the card
      CTA1: {
        label: profile.c_primaryCTA ? profile.c_primaryCTA.label : null, // The CTA's label
        iconName: 'chevron', // The icon to use for the CTA
        url: Formatter.ctaLink(profile.c_primaryCTA), // The URL a user will be directed to when clicking
        target: '_top', // Where the new URL will be opened
        eventType: 'CTA_CLICK', // Type of Analytics event fired when clicking the CTA
        eventOptions: this.addDefaultEventOptions()
      },
      // The secondary CTA of the card
      CTA2: {
        label: profile.c_secondaryCTA ? profile.c_secondaryCTA.label : null,
        iconName: 'chevron',
        url: Formatter.ctaLink(profile.c_secondaryCTA),
        target: '_top',
        eventType: 'CTA_CLICK',
        eventOptions: this.addDefaultEventOptions()
      }
    };
  }
}

ANSWERS.registerComponentType(professional_locationCardComponent);
