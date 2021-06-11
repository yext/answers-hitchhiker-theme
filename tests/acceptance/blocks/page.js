import { Selector, t } from 'testcafe';

/**
 * Models the user interaction with the page as a whole
 */
class Page {
  constructor () {
    this._document = Selector('.YxtPage-doc');
  }

  async scrollToBottom () {
    await t.scroll(this._document, 'bottom');
  }
}

export default new Page();