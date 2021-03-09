{{> cards/card_component componentName='multilang-faq-accordion' }}

class multilang_faq_accordionCardComponent extends BaseCard['multilang-faq-accordion'] {
  constructor(config = {}, systemConfig = {}) {
    super(config, systemConfig);
  }

  /**
   * This returns an object that will be called `card`
   * in the template. Put all mapping logic here.
   *
   * @param {Object} profile of the entity in the card
   */
  dataForRender(profile) {
    return {
      title: profile.question || profile.name, // The header text of the card
      // subtitle: '', // The sub-header text of the card
      details: profile.answer ? ANSWERS.formatRichText(profile.answer, "answer", "_top") : null, // The text in the body of the card
      // If the card's details are longer than a certain character count, you can truncate the
      // text. A toggle will be supplied that can show or hide the truncated text.
      // showMoreDetails: {
      //   showMoreLimit: null, // Character count limit
      //   showMoreText: '', // Label when toggle will show truncated text
      //   showLessText: '' // Label when toggle will hide truncated text
      // },
      isExpanded: false, // Whether the accordion is expanded on page load
      // The primary CTA of the card
      CTA1: {
        label: profile.c_primaryCTA ? profile.c_primaryCTA.label : null, // The CTA's label
        // iconName: '', // The icon to use for the CTA
        url: Formatter.generateCTAFieldTypeLink(profile.c_primaryCTA), // The URL a user will be directed to when clicking
        target: '_top', // Where the new URL will be opened. To open in a new tab use '_blank'
        eventType: 'CTA_CLICK', // Type of Analytics event fired when clicking the CTA
        // Event options for the analytics event fired when this CTA is clicked.
        eventOptions: this.addDefaultEventOptions({ /* Add additional options here */ }),
        // ariaLabel: '', // Accessible text providing a descriptive label for the CTA
      },
      // The secondary CTA of the card
      CTA2: {
        label: profile.c_secondaryCTA ? profile.c_secondaryCTA.label : null,
        // iconName: '',
        url: Formatter.generateCTAFieldTypeLink(profile.c_secondaryCTA),
        target: '_top',
        eventType: 'CTA_CLICK',
        eventOptions: this.addDefaultEventOptions({ /* Add additional options here */ }),
        // ariaLabel: '',
      },
    };
  }

  onMount() {
    const self = this;
    const accordionToggleSelector = '.js-HitchhikerFaqAccordion-toggle';
    const accordionContentSelector = '.js-HitchhikerFaqAccordion-content';
    const accordionExpandedClass = 'HitchhikerFaqAccordion--expanded';
    const accordionCardSelector = '.js-HitchhikerFaqAccordion';

    const accordionToggleEl = self._container.querySelector(accordionToggleSelector);
    if (!accordionToggleEl) {
      return;
    }

    const contentEl = this._container.querySelector(accordionContentSelector);
    let isExpanded = this._container.querySelector(`.${accordionExpandedClass}`);
    contentEl.style.height = `${isExpanded ? contentEl.scrollHeight : 0}px`;
    const linkEls = contentEl.querySelectorAll('a');
    this._setLinksInteractivity(linkEls, isExpanded);

    const cardEl = this._container.querySelector(accordionCardSelector);

    accordionToggleEl.addEventListener('click', function() {
      isExpanded = !isExpanded;
      cardEl.classList.toggle(accordionExpandedClass, isExpanded);
      this.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
      contentEl.style.height = `${isExpanded ? contentEl.scrollHeight : 0}px`;
      contentEl.setAttribute('aria-hidden', isExpanded ? 'false' : 'true');
      self._setLinksInteractivity(linkEls, isExpanded);

      if (self.analyticsReporter) {
        const event = new ANSWERS.AnalyticsEvent(isExpanded ? 'ROW_EXPAND' : 'ROW_COLLAPSE')
        .addOptions({
          verticalKey: self.verticalKey,
          entityId: self.result._raw.id,
          searcher: self._config.isUniversal ? 'UNIVERSAL' : 'VERTICAL'
        });
        self.analyticsReporter.report(event);
      }
    });

    super.onMount();
  }

  /**
   * Sets the interactivity of the link elements in a WCAG-compliant way based on
   * whether the link is visible
   *
   * @param {Array<Element>} linkEls
   * @param {boolean} isVisible
   */
  _setLinksInteractivity(linkEls, isVisible) {
    for (const linkEl of linkEls) {
      linkEl.setAttribute('aria-hidden', isVisible ? 'false' : 'true');
      linkEl.setAttribute('tabindex', isVisible ? '0' : '-1');
    }
  }

  /**
   * The template to render
   * @returns {string}
   * @override
   */
  static defaultTemplateName (config) {
    return 'cards/multilang-faq-accordion';
  }
}

ANSWERS.registerTemplate(
  'cards/multilang-faq-accordion',
  {{{stringifyPartial (read 'cards/multilang-faq-accordion/template') }}}
);
ANSWERS.registerComponentType(multilang_faq_accordionCardComponent);
