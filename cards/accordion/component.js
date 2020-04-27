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
      // details: profile.answer, // The text in the body of the card
      // The calls to action on the card
      callsToAction: [
        this.CTA1(profile.c_primaryCta),
        this.CTA2(profile.c_secondaryCta)
      ]
    };
  }

  CTA1(primaryCta = {}) {
    const { label, url } = primaryCta;
    if (!url) {
      return null;
    }
    return {
      label: label,
      iconName: '',
      url: url,
      target: '_top',
      eventType: 'CTA_CLICK'
    }
  }

  CTA2(secondaryCta = {}) {
    const { label, url } = secondaryCta;
    if (!url) {
      return null;
    }
    return {
      label: label,
      iconName: '',
      url: url,
      target: '_top',
      eventType: 'CTA_CLICK'
    }
  }

  onMount() {
    const self = this;
    const accordionToggleSelector = '.js-HitchhikerAccordionCard-toggle';
    const accordionContentSelector = '.js-HitchhikerAccordionCard-content';
    const accordionExpandedClass = 'HitchhikerAccordionCard--expanded';

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