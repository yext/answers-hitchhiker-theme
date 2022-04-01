{{> cards/card_component componentName='multilang-link-standard' }}

class multilang_link_standardCardComponent extends BaseCard['multilang-link-standard'] {
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
      title: profile.htmlTitle, // The header text of the card
      url: profile.link, // If the card title is a clickable link, set URL here
      target: linkTarget, // If the title's URL should open in a new tab, etc.
      titleEventOptions: this.addDefaultEventOptions(),
      // subtitle: '', // The sub-header text of the card
      // If the card's details are longer than a certain character count, you can truncate the
      // text. A toggle will be supplied that can show or hide the truncated text.
      // showMoreDetails: {
      //   showMoreLimit: 750, // Character count limit
      //   showMoreText: {{ translateJS phrase='Show more' }}, // Label when toggle will show truncated text
      //   showLessText: {{ translateJS phrase='Show less' }} // Label when toggle will hide truncated text
      // },
      details: profile.htmlSnippet, // The text in the body of the card
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
    return 'cards/multilang-link-standard';
  }
}

ANSWERS.registerTemplate(
  'cards/multilang-link-standard',
  {{{stringifyPartial (read 'cards/multilang-link-standard/template') }}}
);
ANSWERS.registerComponentType(multilang_link_standardCardComponent);
