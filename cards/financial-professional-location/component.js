{{> cards/card_component componentName='financial-professional-location' }}

class financial_professional_locationCardComponent extends BaseCard['financial-professional-location'] {
  constructor(config = {}, systemConfig = {}) {
    super(config, systemConfig);
  }

  onMount() {
    const onVerticalFullPageMap = !!document.querySelector('.js-answersVerticalFullPageMap');
    onVerticalFullPageMap && registerVerticalFullPageMapCardListeners(this);
    super.onMount();
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
      showOrdinal: true, // Show the map pin number on the card. Only supported for universal search
      title: profile.name, // The header text of the card
      // subtitle: '', // The sub-header text of the card
      url: profile.website || profile.landingPageUrl, // If the card title is a clickable link, set URL here
      target: linkTarget, // If the title's URL should open in a new tab, etc.
      titleEventOptions: this.addDefaultEventOptions(),
      address: Formatter.address(profile), // The address for the card
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
      distance: Formatter.toLocalizedDistance(profile),
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
        iconName: 'chevron',
        url: Formatter.generateCTAFieldTypeLink(profile.c_secondaryCTA),
        target: linkTarget,
        eventType: 'CTA_CLICK',
        eventOptions: this.addDefaultEventOptions(),
        // ariaLabel: ''
      },
      feedback: false, // Shows thumbs up/down buttons to provide feedback on the result card
      feedbackTextOnSubmission: 'Thanks!', // Text to display after a thumbs up/down is clicked
      positiveFeedbackSrText: 'This answered my question', // Screen reader only text for thumbs-up
      negativeFeedbackSrText: 'This did not answer my question' // Screen reader only text for thumbs-down
    };
  }

  /**
   * The template to render
   * @returns {string}
   * @override
   */
  static defaultTemplateName (config) {
    return 'cards/financial-professional-location';
  }
}

ANSWERS.registerTemplate(
  'cards/financial-professional-location',
  {{{stringifyPartial (read 'cards/financial-professional-location/template') }}}
);
ANSWERS.registerComponentType(financial_professional_locationCardComponent);
