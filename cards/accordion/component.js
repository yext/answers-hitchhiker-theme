{{> cards/card_component componentName='AccordionCard'}}

class AccordionCardComponent extends BaseCard.AccordionCard {
  constructor(config = {}, systemConfig = {}) {
    super(config, systemConfig);
    this.setTemplate(`{{{read 'cards/accordion/template' }}}`);
  }

  /**
   * This returns an object that will be called `card`
   * in the template. Put all mapping logic here.
   *
   * @param {Object} profile of the entity in the card
   */
  dataForRender(profile) {
    // Extract the data for the primary and secondary CTAs from the profile.
    // Apply a sane default if not present in the profile.
    const primaryCTAData = profile.c_primaryCTA || {};
    const secondaryCTAData = profile.c_secondaryCTA || {};

    return {
      title: profile.name, // The header text of the card
      // subtitle: '', // The sub-header text of the card
      details: profile.answer, // The text in the body of the card
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
        label: primaryCTAData.label, // The CTA's label
        // iconName: '', // The icon to use for the CTA
        url: primaryCTAData.url, // The URL a user will be directed to when clicking
        target: '_top', // Where the new URL will be opened. To open in a new tab use '_blank'
        eventType: 'CTA_CLICK', // Type of Analytics event fired when clicking the CTA
        // Event options for the analytics event fired when this CTA is clicked.
        eventOptions: this.addDefaultEventOptions({ /* Add additional options here */ })
      },
      // The secondary CTA of the card
      CTA2: {
        label: secondaryCTAData.label,
        // iconName: '',
        url: secondaryCTAData.url,
        target: '_top',
        eventType: 'CTA_CLICK',
        eventOptions: this.addDefaultEventOptions({ /* Add additional options here */ })
      },
    };
  }

  onMount() {
    const self = this;
    const accordionToggleSelector = '.js-HitchhikerAccordionCard-toggle';
    const accordionContentSelector = '.js-HitchhikerAccordionCard-content';
    const accordionExpandedClass = 'HitchhikerAccordionCard--expanded';
    const accordionCardSelector = '.js-HitchhikerAccordionCard';

    const accordionToggleEl = self._container.querySelector(accordionToggleSelector);
    if (!accordionToggleEl) {
      return;
    }

    const contentEl = this._container.querySelector(accordionContentSelector);
    let isExpanded = this._container.querySelector(`.${accordionExpandedClass}`);
    contentEl.style.height = `${isExpanded ? contentEl.scrollHeight : 0}px`;

    const cardEl = this._container.querySelector(accordionCardSelector);

    accordionToggleEl.addEventListener('click', function() {
      isExpanded = !isExpanded;
      cardEl.classList.toggle(accordionExpandedClass, isExpanded);
      this.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
      contentEl.style.height = `${isExpanded ? contentEl.scrollHeight : 0}px`;
      contentEl.setAttribute('aria-hidden', isExpanded ? 'false' : 'true');

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
}

ANSWERS.registerComponentType(AccordionCardComponent);
