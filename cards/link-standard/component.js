{{> cards/card_component componentName='link-standard' }}

class link_standardCardComponent extends BaseCard['link-standard'] {
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
      //   showMoreText: 'Show more', // Label when toggle will show truncated text
      //   showLessText: 'Show less' // Label when toggle will hide truncated text
      // },
      details: profile.htmlSnippet, // The text in the body of the card
    };
  }

  /**
   * The template to render
   * @returns {string}
   * @override
   */
  static defaultTemplateName (config) {
    return 'cards/link-standard';
  }
}

ANSWERS.registerTemplate(
  'cards/link-standard',
  {{{stringifyPartial (read 'cards/link-standard/template') }}}
);
ANSWERS.registerComponentType(link_standardCardComponent);
