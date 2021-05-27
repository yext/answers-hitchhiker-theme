{{> cards/card_component componentName='multilang-product-prominentvideo' }}

class multilang_product_prominentvideoCardComponent extends BaseCard['multilang-product-prominentvideo'] {
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
    const videoUrl = profile.videos && profile.videos[0]?.video?.url;
    const youtubeVideoId = videoUrl?.split('watch?v=')[1];
    const youtubeUrl = youtubeVideoId ? 'https://www.youtube.com/embed/' + youtubeVideoId : null;
    // const vimeoUrl = profile.c_vimeo;

    return {
      title: profile.name, // The header text of the card
      url: profile.landingPageUrl, // If the card title is a clickable link, set URL here
      target: '_top', // If the title's URL should open in a new tab, etc.
      titleEventOptions: this.addDefaultEventOptions(),
      subtitle: profile.featuredMessage?.description, // The sub-header text of the card
      videoUrl: youtubeUrl,
      details: profile.richTextDescription ? ANSWERS.formatRichText(profile.richTextDescription, 'richTextDescription', '_top') : null, // The text in the body of the card
      // If the card's details are longer than a certain character count, you can truncate the
      // text. A toggle will be supplied that can show or hide the truncated text.
      // Note: If you are using rich text for the details, you should not enable this feature.
      // showMoreDetails: {
      //   showMoreLimit: 24, // Character count limit
      //   showMoreText: {{ translateJS phrase='Show more' }}, // Label when toggle will show truncated text
      //   showLessText: {{ translateJS phrase='Show less' }} // Label when toggle will hide truncated text
      // },
      // The primary CTA of the card
      CTA1: {
        label: profile.c_primaryCTA ? profile.c_primaryCTA.label : null, // The CTA's label
        iconName: 'chevron', // The icon to use for the CTA
        url: Formatter.generateCTAFieldTypeLink(profile.c_primaryCTA), // The URL a user will be directed to when clicking
        target: '_top', // Where the new URL will be opened
        eventType: 'CTA_CLICK', // Type of Analytics event fired when clicking the CTA
        eventOptions: this.addDefaultEventOptions(),
        // ariaLabel: '', // Accessible text providing a descriptive label for the CTA
      },
      // The secondary CTA of the card
      CTA2: {
        label: profile.c_secondaryCTA ? profile.c_secondaryCTA.label : null,
        iconName: 'chevron',
        url: Formatter.generateCTAFieldTypeLink(profile.c_secondaryCTA),
        target: '_top',
        eventType: 'CTA_CLICK',
        eventOptions: this.addDefaultEventOptions(),
        // ariaLabel: '',
      }
    };
  }

  /**
   * The template to render
   * @returns {string}
   * @override
   */
  static defaultTemplateName (config) {
    return 'cards/multilang-product-prominentvideo';
  }
}

ANSWERS.registerTemplate(
  'cards/multilang-product-prominentvideo',
  {{{stringifyPartial (read 'cards/multilang-product-prominentvideo/template') }}}
);
ANSWERS.registerComponentType(multilang_product_prominentvideoCardComponent);
