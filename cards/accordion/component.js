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
    return {
      title: profile.name, // The header text of the card
      // subtitle: '', // The sub-header text of the card
      details: profile.answer, // The text in the body of the card
      // The calls to action on the card
      callsToAction: profile.c_ctas ? profile.c_ctas.map((cta) => {
        return {
          label: cta.text, // The label of the CTA
          url: cta.url, // The URL a user will be directed to when clicking
          iconName: cta.icon, // The icon to use for the CTA
          target: "_parent", // If the URL will be opened in a new tab, etc.
          modifiers: "yxt-CTA--solo", // Additional CSS classes for the CTA
          eventType: "CTA_CLICK" // Type of Analytics event fired when clicking the CTA
        };
      }) : [],
    };
  }

  onMount() {
    const self = this;
    const accordionToggleSelector = '.js-yxt-AccordionCard-toggle';
    const accordionContentSelector = '.js-yxt-AccordionCard-content';
    const accordionExpandedClass = 'yxt-AccordionCard--expanded';

    const accordionToggleEl = self._container.querySelector(accordionToggleSelector);
    if (!accordionToggleEl) {
      return;
    }

    accordionToggleEl.addEventListener('click', function() {
      this.classList.toggle(accordionExpandedClass);
      const isExpanded = this.classList.contains(accordionExpandedClass);
      const contentEl = this.parentNode.querySelector(accordionContentSelector);

      this.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
      contentEl.style.height = `${isExpanded ? contentEl.scrollHeight : 0}px`;
      contentEl.setAttribute('aria-hidden', isExpanded ? 'false' : 'true');

      if (self.analyticsReporter) {
        const event = new ANSWERS.AnalyticsEvent(self.isExpanded ? 'ROW_EXPAND' : 'ROW_COLLAPSE')
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