{{> cards/card_component componentName='menuitem-standard' }}

class menuitem_standardCardComponent extends BaseCard['menuitem-standard'] {
  constructor(config = {}, systemConfig = {}) {
    super(config, systemConfig);
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
      url: profile.landingPageUrl, // If the card title is a clickable link, set URL here
      target: '_top', // If the title's URL should open in a new tab, etc.
      image: Formatter.image(profile.c_photo).url, // The URL of the image to display on the card
      altText: Formatter.image(profile.c_photo).alternateText,  // The alternate text for the image
      // tagLabel: '', // The label of the displayed image
      titleEventOptions: this.addDefaultEventOptions(),
      listTitle: 'Allergens',
      listItems: profile.c_allergens,
      subtitle: (profile.c_price ? '$'+profile.c_price : '')
        + (profile.c_price && profile.c_calories ? ' | ' : '')
        + (profile.c_calories ? profile.c_calories + ' calories' : ''), // The sub-header text of the card
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
        label: 'Order Now', // The CTA's label
        iconName: 'chevron', // The icon to use for the CTA
        url: profile.orderUrl, // The URL a user will be directed to when clicking
        target: '_top', // Where the new URL will be opened
        eventType: 'CTA_CLICK', // Type of Analytics event fired when clicking the CTA
        eventOptions: this.addDefaultEventOptions(),
        // ariaLabel: '', // Accessible text providing a descriptive label for the CTA
      },
      // The secondary CTA of the card
      CTA2: {
        label: 'View Menu',
        iconName: 'magnifying_glass',
        url: profile.landingPageUrl,
        target: '_top',
        eventType: 'CTA_CLICK',
        eventOptions: this.addDefaultEventOptions(),
        // ariaLabel: '',
      }
    };
  }

  /**
   * The template to render
   * @returns {string}
   * @override
   */
  static defaultTemplateName (config) {
    return 'cards/menuitem-standard';
  }
}

ANSWERS.registerTemplate(
  'cards/menuitem-standard',
  `{{{read 'cards/menuitem-standard/template' }}}`
);
ANSWERS.registerComponentType(menuitem_standardCardComponent);
