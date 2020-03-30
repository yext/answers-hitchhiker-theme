{{> cards_card_component componentName='AccordionCard'}}

class AccordionCardComponent extends BaseCard.AccordionCard {
  constructor(config = {}, systemConfig = {}) {
    super(config, systemConfig);
    this.setTemplate(`{{{read 'cards_accordion_template' }}}`);
  }

  /**
   * This returns an object that will be called `card`
   * in the template. Put all mapping logic here.
   *
   * @param {Object} profile of the entity in the card
   */
  dataForRender(profile) {
    return {
      title: profile.name,
      details: profile.answer,
      callsToAction: profile.c_ctas ? profile.c_ctas.map((cta) => {
        return {
          "label": cta.text,
          "url": cta.url,
          "iconName": cta.icon,
          "target": "_parent",
        };
      }) : null,
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
        self.analyticsReporter.report({
          eventType: isExpanded ? 'ROW_EXPAND' : 'ROW_COLLAPSE',
          verticalKey: self.verticalKey,
          entityId: self.result._raw.id,
          searcher: self._config.isUniversal ? 'UNIVERSAL' : 'VERTICAL'
        });
      }
    });

    super.onMount();
  }
}

ANSWERS.registerComponentType(AccordionCardComponent);