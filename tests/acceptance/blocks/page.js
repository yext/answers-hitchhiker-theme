import { Selector, t } from 'testcafe';

/**
 * Models the user interaction with the page as a whole
 */
class Page {
  constructor () {
    this._document = Selector('.YxtPage-doc');
    this._iframe = Selector('#answers-container iframe');
  }

  async scrollToBottom () {
    await t.scroll(this._document, 'bottom');
  }

  /**
   * Switches the browser context to the iframe
   */
  async switchToIframe () {
    await t.switchToIframe(this._iframe);
  }
}

export default new Page();