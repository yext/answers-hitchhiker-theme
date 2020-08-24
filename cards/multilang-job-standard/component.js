{{> cards/card_component componentName='multilang-job-standard' }}

class multilang_job_standardCardComponent extends BaseCard['multilang-job-standard'] {
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
      // image: '', // The URL of the image to display on the card
      // tagLabel: '', // The label of the displayed image
      titleEventOptions: this.addDefaultEventOptions(),
      subtitle: profile.c_department, // The sub-header text of the card
      details: profile.description, // The text in the body of the card
      // If the card's details are longer than a certain character count, you can truncate the
      // text. A toggle will be supplied that can show or hide the truncated text.
      showMoreDetails: {
        showMoreLimit: 500, // Character count limit
        showMoreText: {{ translateJS phrase='Show more' }}, // Label when toggle will show truncated text
        showLessText: {{ translateJS phrase='Show less' }} // Label when toggle will hide truncated text
      },
      // The primary CTA of the card
      CTA1: {
        label: {{ translateJS phrase='Apply Now' }}, // The CTA's label
        iconName: 'briefcase', // The icon to use for the CTA
        url: profile.applicationUrl || profile.landingPageUrl, // The URL a user will be directed to when clicking
        target: '_top', // Where the new URL will be opened
        eventType: 'CTA_CLICK', // Type of Analytics event fired when clicking the CTA
        eventOptions: this.addDefaultEventOptions(),
        // ariaLabel: '', // Accessible text providing a descriptive label for the CTA
      }
    };
  }

  /**
   * The template to render
   * @returns {string}
   * @override
   */
  static defaultTemplateName (config) {
    return 'cards/multilang-job-standard';
  }
}

ANSWERS.registerTemplate(
  'cards/multilang-job-standard',
  `{{{read 'cards/multilang-job-standard/template' }}}`
);
ANSWERS.registerComponentType(multilang_job_standardCardComponent);
