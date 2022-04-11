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
    this.youtubeUrl = Formatter.getYoutubeUrl(profile.videos || []);
    this.vimeoUrl = profile.c_vimeo;

    const linkTarget = AnswersExperience.runtimeConfig.get('linkTarget') || '_top';

    return {
      title: profile.name, // The header text of the card
      url: profile.landingPageUrl, // If the card title is a clickable link, set URL here
      target: linkTarget, // If the title's URL should open in a new tab, etc.
      titleEventOptions: this.addDefaultEventOptions(),
      subtitle: profile.featuredMessage?.description, // The sub-header text of the card
      videoUrl: this.youtubeUrl || this.vimeoUrl,
      details: profile.richTextDescription ? ANSWERS.formatRichText(profile.richTextDescription, 'richTextDescription', linkTarget) : null, // The text in the body of the card
      // If the card's details are longer than a certain character count, you can truncate the
      // text. A toggle will be supplied that can show or hide the truncated text.
      // showMoreDetails: {
      //   truncatedDetails: profile.richTextDescription ? ANSWERS.formatRichText(profile.richTextDescription, 'richTextDescription', linkTarget, 24) : null, // The truncated rich text
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
        iconName: 'chevron',
        url: Formatter.generateCTAFieldTypeLink(profile.c_secondaryCTA),
        target: linkTarget,
        eventType: 'CTA_CLICK',
        eventOptions: this.addDefaultEventOptions(),
        // ariaLabel: '',
      },
      feedback: false, // Shows thumbs up/down buttons to provide feedback on the result card
      feedbackTextOnSubmission: {{ translateJS phrase='Thanks!' }}, // Text to display after a thumbs up/down is clicked
      positiveFeedbackSrText: {{ translateJS phrase='This answered my question' }}, // Screen reader only text for thumbs-up
      negativeFeedbackSrText: {{ translateJS phrase='This did not answer my question' }} // Screen reader only text for thumbs-down
    };
  }

  onMount() {
    super.onMount();
    const videoSelector = '.js-HitchhikerProductProminentVideo-video';
    const videoEl = this._container.querySelector(videoSelector);
    if (!videoEl) {
      return;
    }
    const addPlayer = videoApi => {
      videoApi.addPlayer(videoEl, {
        onPlay: () => this.onPlay()
      });
    };
    if (this.youtubeUrl) {
      HitchhikerJS.requireYoutubeAPI().then(addPlayer);
    } else if (this.vimeoUrl) {
      HitchhikerJS.requireVimeoAPI().then(addPlayer);
    }
  }

  onPlay() {
    const event = new ANSWERS.AnalyticsEvent('CTA_CLICK')
      .addOptions({
        verticalKey: this.verticalKey,
        entityId: this.result?._raw?.id,
        searcher: this._config.isUniversal ? 'UNIVERSAL' : 'VERTICAL',
        ctaLabel: 'video_played'
      });
    this.analyticsReporter.report(event);
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
