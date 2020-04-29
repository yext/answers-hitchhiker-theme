{{> cards/card_component componentName='LinkCard'}}

class LinkCardComponent extends BaseCard.LinkCard {
  constructor(config = {}, systemConfig = {}) {
    super(config, systemConfig);
    this.setTemplate(`{{{read 'cards/link/template' }}}`);
  }

  /**
   * This returns an object that will be called `card`
   * in the template. Put all mapping logic here.
   *
   * @param profile profile of the entity in the card
   */
  dataForRender(profile) {
    return {
      title: profile.htmlTitle, // The header text of the card
      url: profile.link, // If the card title is a clickable link, set URL here
      target: '_top', // If the title's URL should open in a new tab, etc.
      titleEventOptions: this.addDefaultEventOptions(),
      // subtitle: '', // The sub-header text of the card
      details: profile.htmlSnippet, // The text in the body of the card
    };
  }
}

ANSWERS.registerComponentType(LinkCardComponent);