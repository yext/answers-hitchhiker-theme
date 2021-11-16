{{> cards/card_component componentName='multilang-product-standard' }}

class multilang_product_standardCardComponent extends BaseCard['multilang-product-standard'] {
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
    let imageUrl = '';
    let alternateText = '';
    if (profile.photoGallery && profile.photoGallery[0]) {
      imageUrl = Formatter.image(profile.photoGallery[0]).url;
      alternateText = Formatter.image(profile.photoGallery[0]).alternateText;
    }
    const linkTarget = AnswersExperience.runtimeConfig.get('linkTarget') || '_top';

    return {
      title: profile.name, // The header text of the card
      url: profile.landingPageUrl, // If the card title is a clickable link, set URL here
      target: linkTarget, // If the title's URL should open in a new tab, etc.
      image: imageUrl, // The URL of the image to display on the card
      altText: alternateText,  // The alternate text for the image
      titleEventOptions: this.addDefaultEventOptions(),
      subtitle: Formatter.price(profile.price), // The sub-header text of the card
      details: profile.richTextDescription ? ANSWERS.formatRichText(profile.richTextDescription, 'richTextDescription', linkTarget) : null, // The text in the body of the card
      // If the card's details are longer than a certain character count, you can truncate the
      // text. A toggle will be supplied that can show or hide the truncated text.
      // Note: If you are using rich text for the details, you should not enable this feature.
      // showMoreDetails: {
      //   showMoreLimit: 350, // Character count limit
      //   showMoreText: {{ translateJS phrase='Show more' }}, // Label when toggle will show truncated text
      //   showLessText: {{ translateJS phrase='Show less' }} // Label when toggle will hide truncated text
      // },
      // The primary CTA of the card
      CTA1: {
        label: profile.c_primaryCTA ? profile.c_primaryCTA.label : null, // The CTA's label
        iconName: 'chevron', // The icon to use for the CTA
        url: Formatter.generateCTAFieldTypeLink(profile.c_primaryCTA), // The URL a user will be directed to when clicking
        target: linkTarget, // Where the new URL will be opened
        eventType: 'CTA_CLICK', // Type of Analytics event fired when clicking the CTA
        eventOptions: this.addDefaultEventOptions(),
        // ariaLabel: '', // Accessible text providing a descriptive label for the CTA
      },
      // The secondary CTA of the card
      CTA2: {
        label: profile.c_secondaryCTA ? profile.c_secondaryCTA.label : null,
        iconName: 'chevron', // The icon to use for the CTA
        url: Formatter.generateCTAFieldTypeLink(profile.c_secondaryCTA),
        target: linkTarget, // Where the new URL will be opened
        eventType: 'CTA_CLICK', // Type of Analytics event fired when clicking the CTA
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
    return 'cards/multilang-product-standard';
  }
}

ANSWERS.registerTemplate(
  'cards/multilang-product-standard',
  {{{stringifyPartial (read 'cards/multilang-product-standard/template') }}}
);
ANSWERS.registerComponentType(multilang_product_standardCardComponent);
