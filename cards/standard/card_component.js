const template = `{{{read 'cards_standard_card_template' }}}`;

class StandardCardConfig {
  constructor(config = {}) {
    Object.assign(this, config);

    const result = config.data.result || {};

    const rawResult = result._raw || {};

    let cardMappings = config.cardMappings || {};
    Object.assign(this, this.applyCardMappings(result, cardMappings));

    this.title = this.title || result.title || rawResult.name || '';

    this.details = this.details || result.details || rawResult.description || '';

    this.url = this.url || result.link || rawResult.website;

    this.subtitle = this.subtitle;

    this.callsToAction = this.callsToAction || [];

    this.callsToActionFields = this.callsToActionFields || [];
  }

  /**
   * Used to apply given card mappings from config.
   * @param {Result} result
   * @param {Object|Function} cardMappings
   */
  applyCardMappings(result, cardMappings) {
    const config = {};
    if (typeof cardMappings === 'function') {
      cardMappings = cardMappings(result);
    }
    if (typeof cardMappings === 'object') {
      Object.entries(cardMappings).forEach(([attribute, value]) => {
        if (typeof value === 'function') {
          config[attribute] = value(result);
        } else {
          config[attribute] = value;
        }
      });
    }
    return config;
  }
}


class StandardCardComponent extends ANSWERS.Component {
  constructor(config = {}, systemConfig = {}) {
    super(new StandardCardConfig(config), systemConfig);

    const data = config.data || {};

    this.verticalKey = data.verticalKey;

    this.result = data.result || {};

    this.setTemplate(template);
  }

  setState(data) {
    const details = this._config.details;
    return super.setState({
      ...data,
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