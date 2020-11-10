{{> cards/card_component componentName='multilang-product-prominentimage-clickable' }}

class multilang_product_prominentimage_clickableCardComponent
  extends BaseCard['multilang-product-prominentimage-clickable'] {

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
    let cardUrl = '';
    if (profile.url) {
      cardUrl = profile.url;
    } else if (profile.landingPageUrl) {
      cardUrl = profile.landingPageUrl;
    }

    return {
      title: profile.name, // The header text of the card
      url: cardUrl, // If the card is a clickable link, set URL here
      target: '_top', // If the card URL should open in a new tab, etc.
      titleEventOptions: this.addDefaultEventOptions(),
      subtitle: profile.c_price ? `$${profile.c_price}` : '', // The sub-header text of the card
      image: Formatter.image(profile.c_photo).url, // The URL of the image to display on the card
      altText: Formatter.image(profile.c_photo).alternateText,  // The alternate text for the image
      details: profile.description, // The text in the body of the card
    };
  }

  /**
   * The template to render
   * @returns {string}
   * @override
   */
  static defaultTemplateName (config) {
    return 'cards/multilang-product-prominentimage-clickable';
  }
}

ANSWERS.registerTemplate(
  'cards/multilang-product-prominentimage-clickable',
  `{{{read 'cards/multilang-product-prominentimage-clickable/template' }}}`
);
ANSWERS.registerComponentType(multilang_product_prominentimage_clickableCardComponent);
