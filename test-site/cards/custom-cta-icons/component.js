{{> cards/card_component componentName='custom-cta-icons' }}

class custom_cta_iconsCardComponent extends BaseCard['custom-cta-icons'] {
  constructor(config = {}, systemConfig = {}) {
    super(config, systemConfig);
  }

  dataForRender(profile) {
    const linkTarget = AnswersExperience.runtimeConfig.get('linkTarget') || '_top';
    
    return {
      title: profile.name, 
      url: profile.website,
      target: linkTarget,
      titleEventOptions: this.addDefaultEventOptions(),
      date: Formatter.bigDate(profile),
      subtitle: Formatter.dateRange(profile),
      details: profile.description,
      CTA1: {
        label: 'Hitchhiker Thumb!',
        /**
         * @Test a custom icon url without iconName in the CTA
         * @Expect the custom icon to show up
         */
        iconUrl: 'static/assets/hitchhiker-thumb.jpeg',
        url: 'testUrl',
        target: linkTarget,
        eventType: 'RSVP',
        eventOptions: this.addDefaultEventOptions(),
      },
      CTA2: {
        label: 'AYAYA',
        iconName: 'star',
        /**
         * @Test a custom icon url hen an iconName already exists
         * @Expect the custom icon to show up
         */
        iconUrl: 'static/assets/ayaya.png',
        url: 'testUrl',
        target: linkTarget,
        eventType: 'DRIVING_DIRECTIONS',
        eventOptions: this.addDefaultEventOptions(),
      }
    };
  }

  static defaultTemplateName (config) {
    return 'cards/custom-cta-icons';
  }
}

ANSWERS.registerTemplate(
  'cards/custom-cta-icons',
  {{{stringifyPartial (read 'cards/event-standard/template') }}}
);
ANSWERS.registerComponentType(custom_cta_iconsCardComponent);
