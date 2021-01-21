{{> cards/card_component componentName='product-prominentimage-clickable' }}

class product_prominentimage_clickableCardComponent extends BaseCard['product-prominentimage-clickable'] {

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

    let imageUrl = '';
    let alternateText = '';
    if (profile.photoGallery && profile.photoGallery[0]) {
      imageUrl = Formatter.image(profile.photoGallery[0]).url;
      alternateText = Formatter.image(profile.photoGallery[0]).alternateText;
    }

    return {
      title: profile.name, // The header text of the card
      url: cardUrl, // If the card is a clickable link, set URL here
      target: '_top', // If the card URL should open in a new tab, etc.
      titleEventOptions: this.addDefaultEventOptions(),
      subtitle: Formatter.price(profile.price), // The sub-header text of the card
      image: imageUrl, // The URL of the image to display on the card
      altText: alternateText,  // The alternate text for the image
      details: profile.richTextDescription ? ANSWERS.formatRichText(profile.richTextDescription, 'richTextDescription', '_top') : null, // The text in the body of the card, Warning: cannot contain links
      // tag: profile.stockStatus ? profile.stockStatus : '', // The tag text for the card
    };
  }

  /**
   * The template to render
   * @returns {string}
   * @override
   */
  static defaultTemplateName (config) {
    return 'cards/product-prominentimage-clickable';
  }
}

ANSWERS.registerTemplate(
  'cards/product-prominentimage-clickable',
  {{{stringifyPartial (read 'cards/product-prominentimage-clickable/template') }}}
);
ANSWERS.registerComponentType(product_prominentimage_clickableCardComponent);
