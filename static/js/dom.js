export default class DOM {  
  /**
   * Triggers the event passed in dispatched from the given selector
   * @param {HTMLElement} container container to select from
   * @param {string} selector selector to dispatch event from
   * @param {string} event event to fire
   * @param {Object} settings additional settings
   */
   static triggerCustomEvent(container, selector, event, settings) {
    const e = this.customEvent(event, settings);
    container.querySelector(selector).dispatchEvent(e);
  }

  /**
   * _customEvent is an event constructor polyfill
   * @param {string} event event to fire
   * @param {Object} settings additional settings
   */
  static customEvent(event, settings) {
    const _settings = {
      bubbles: true,
      cancelable: true,
      detail: null,
      ...settings
    };
    const evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(event, _settings.bubbles, _settings.cancelable, _settings.detail);
    return evt;
  }
}