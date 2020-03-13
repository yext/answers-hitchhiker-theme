{{> cards_card_component componentName='StandardCardComponent'}}

const template = `{{{read 'cards_standard_template' }}}`;

class StandardCardComponent extends CardComponent {
  constructor(config = {}, systemConfig = {}) {
    super(config, systemConfig);
    this.setTemplate(template);
  }

  /**
   * This returns an object that will be called `card`
   * in the template. Put all mapping logic here.
   *
   * @param profile profile of the entity in the card
   */
  dataForRender(profile) {
    let title = profile.name.toUpperCase();
    let subtitle = '';
    let details = profile.description;
    let titleUrl = profile.websites;
    let urlShouldOpenInNewWindow = true;
    let callsToAction = [
      {
        url: profile.c_primaryCTA,
        iconName: 'chevron',
        label: 'View Details'
      }
    ];

    return {
      title: title,
      titleUrl: titleUrl,
      newWindow: urlShouldOpenInNewWindow,
      subtitle: subtitle,
      details: details,
      callsToAction: callsToAction
    };
  }
}

ANSWERS.registerComponentType(StandardCardComponent);