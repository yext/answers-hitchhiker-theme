{{> cards/card_component componentName='product-prominentimage-clickable' }}

class product_prominentimage_clickableCardComponent
  extends BaseCard['product-prominentimage-clickable'] {

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

    let price = '';
    if (profile.c_price
      && profile.c_price[0]
      && profile.c_price[0].currency
      && profile.c_price[0].value) {
      price = `$${profile.c_price[0].value}`;
    }

    let imageUrl = '';
    if (profile.photoGallery && profile.photoGallery[0]) {
      imageUrl = Formatter.image(profile.photoGallery[0]).url;
    }

    let tag = '';
    if (profile.stockStatus && profile.stockStatus !== 'In Stock') {
      tag = profile.stockStatus;
    }

    return {
      title: profile.name, // The header text of the card
      url: cardUrl, // If the card is a clickable link, set URL here
      target: '_top', // If the card URL should open in a new tab, etc.
      titleEventOptions: this.addDefaultEventOptions(),
      subtitle: price, // The sub-header text of the card
      image: imageUrl, // The URL of the image to display on the card
      altText: Formatter.image(profile.c_photo).alternateText,  // The alternate text for the image
      details: profile.richTextDescription ? ANSWERS.formatRichText(profile.richTextDescription, 'richTextDescription', '_top') : null, // The text in the body of the card, Warning: cannot contain links
      //tag: tag, // The tag text for the card
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
  `{{{read 'cards/product-prominentimage-clickable/template' }}}`
);
ANSWERS.registerComponentType(product_prominentimage_clickableCardComponent);
