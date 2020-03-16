BaseCard = typeof(BaseCard) !== 'undefined' ?
  BaseCard :
  {};

BaseCard.{{componentName}} = class extends ANSWERS.Component {
  constructor(config = {}, systemConfig = {}) {
    super(config, systemConfig);
    const data = config.data || {};

    this.verticalKey = data.verticalKey;
    this.result = data.result || {};
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
      _ctaModifiers: [`{{componentName}}`],
      ...opts
    });
  }

  static get type() {
    return `{{componentName}}`;
  }

  static areDuplicateNamesAllowed() {
    return true;
  }
}