const template = `{{{read 'cards_standard_card_template' }}}`;
class StandardCardComponent extends ANSWERS.Component {
  /**
   * This returns an object that will be called `card`
   * in the template. Put all mapping logic here.
   *
   * @param profile profile of the entity in the card
   */
  dataForRender(profile) {
    let title = profile.name;
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

  /***********************************************
   *
   * Do not make changes below this point
   *
   **********************************************/
  constructor(config = {}, systemConfig = {}) {
    super(config, systemConfig);
    const data = config.data || {};

    this.verticalKey = data.verticalKey;
    this.result = data.result || {};
    this.setTemplate(template);
  }

  setState(data) {
    const details = this._config.details;
    return super.setState({
      ...data,
      card: this.dataForRender(this.result._raw),
      result: this.result,
      details
    });
  }

  addChild(data, type, opts) {
    const updatedData = {
      verticalKey: this.verticalKey,
      result: data
    };
    return super.addChild(updatedData, type, {
      callsToAction: this._config.callsToAction,
      callsToActionFields: this._config.callsToActionFields,
      isUniversal: this._config.isUniversal,
      _ctaModifiers: ['StandardCard'],
      ...opts
    });
  }

  static get type() {
    return 'StandardCard';
  }

  static areDuplicateNamesAllowed() {
    return true;
  }
}

ANSWERS.registerComponentType(StandardCardComponent);