{{> cards/card_component componentName='multilang-menuitem-standard' }}

class multilang_menuitem_standardCardComponent extends BaseCard['multilang-menuitem-standard'] {
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
    const linkTarget = AnswersExperience.runtimeConfig.get('linkTarget') || '_top';

    return {
      title: profile.name, // The header text of the card
      url: profile.landingPageUrl, // If the card title is a clickable link, set URL here
      target: linkTarget, // If the title's URL should open in a new tab, etc.
      image: Formatter.image(profile.c_photo).url, // The URL of the image to display on the card
      altText: Formatter.image(profile.c_photo).alternateText,  // The alternate text for the image
      // tagLabel: '', // The label of the displayed image
      titleEventOptions: this.addDefaultEventOptions(),
      listTitle: {{ translateJS phrase='Allergens' }},
      listItems: profile.c_allergens,
      subtitle: (profile.c_price ? '$'+profile.c_price : '')
        + (profile.c_price && profile.c_calories ? ' | ' : '')
        + (profile.c_calories ? {{ translateJS phrase='[[calorieCount]] calories' calorieCount=profile.c_calories }} : ''), // The sub-header text of the card
      details: profile.description, // The text in the body of the card
      // If the card's details are longer than a certain character count, you can truncate the
      // text. A toggle will be supplied that can show or hide the truncated text.
      showMoreDetails: {
        showMoreLimit: 350, // Character count limit
        showMoreText: {{ translateJS phrase='Show more' }}, // Label when toggle will show truncated text
        showLessText: {{ translateJS phrase='Show less' }} // Label when toggle will hide truncated text
      },
      // The primary CTA of the card
      CTA1: {
        label: {{ translateJS phrase='Order Now' }}, // The CTA's label
        iconName: 'chevron', // The icon to use for the CTA
        url: profile.orderUrl && profile.orderUrl.url, // The URL a user will be directed to when clicking
        target: linkTarget, // Where the new URL will be opened
        eventType: 'CTA_CLICK', // Type of Analytics event fired when clicking the CTA
        eventOptions: this.addDefaultEventOptions(),
        // ariaLabel: '', // Accessible text providing a descriptive label for the CTA
      },
      // The secondary CTA of the card
      CTA2: {
        label: {{ translateJS phrase='View Menu' }},
        iconName: 'magnifying_glass',
        url: profile.landingPageUrl,
        target: linkTarget,
        eventType: 'CTA_CLICK',
        eventOptions: this.addDefaultEventOptions(),
        // ariaLabel: '',
      },
      feedback: false, // Shows thumbs up/down buttons to provide feedback on the result card
      feedbackTextOnSubmission: {{ translateJS phrase='Thanks!' }}, // Text to display after a thumbs up/down is clicked
      positiveFeedbackSrText: {{ translateJS phrase='This answered my question' }}, // Screen reader only text for thumbs-up
      negativeFeedbackSrText: {{ translateJS phrase='This did not answer my question' }} // Screen reader only text for thumbs-down
    };
  }

  /**
   * The template to render
   * @returns {string}
   * @override
   */
  static defaultTemplateName (config) {
    return 'cards/multilang-menuitem-standard';
  }
}

ANSWERS.registerTemplate(
  'cards/multilang-menuitem-standard',
  {{{stringifyPartial (read 'cards/multilang-menuitem-standard/template') }}}
);
ANSWERS.registerComponentType(multilang_menuitem_standardCardComponent);
