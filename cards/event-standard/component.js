{{> cards/card_component componentName='event-standard' }}

class event_standardCardComponent extends BaseCard['event-standard'] {
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
    return {
      title: profile.name, // The header text of the card
      url: profile.website, // If the card title is a clickable link, set URL here
      target: '_top', // If the title's URL should open in a new tab, etc.
      titleEventOptions: this.addDefaultEventOptions(),
      date: Formatter.bigDate(profile),
      subtitle: Formatter.dateRange(profile),
      details: profile.description, // The text in the body of the card
      // If the card's details are longer than a certain character count, you can truncate the
      // text. A toggle will be supplied that can show or hide the truncated text.
      // showMoreDetails: {
      //   showMoreLimit: 750, // Character count limit
      //   showMoreText: 'Show more', // Label when toggle will show truncated text
      //   showLessText: 'Show less' // Label when toggle will hide truncated text
      // },
      // The primary CTA of the card
      CTA1: {
        label: 'RSVP', // The CTA's label
        iconName: 'calendar', // The icon to use for the CTA
        url: profile.ticketUrl || profile.website, // The URL a user will be directed to when clicking
        target: '_top', // Where the new URL will be opened
        eventType: 'RSVP', // Type of Analytics event fired when clicking the CTA
        eventOptions: this.addDefaultEventOptions(),
        // ariaLabel: '', // Accessible text providing a descriptive label for the CTA
      },
      // The secondary CTA of the card
      CTA2: {
        label: 'Directions',
        iconName: 'directions',
        url: Formatter.getDirectionsUrl(profile),
        target: '_top',
        eventType: 'DRIVING_DIRECTIONS',
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
    return 'cards/event-standard';
  }
}

ANSWERS.registerTemplate(
  'cards/event-standard',
  {{{stringifyPartial (read 'cards/event-standard/template') }}}
);
ANSWERS.registerComponentType(event_standardCardComponent);
