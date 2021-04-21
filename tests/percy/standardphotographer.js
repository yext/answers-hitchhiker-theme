const Photographer = require('./photographer');
const { waitTillHTMLRendered } = require('./utils');

/**
 * Responsible for navigating answers experiences
 */
class StandardPhotographer extends Photographer {
  /**
   * @param {Object} obj
   * @param {import('puppeteer').Page} obj.page A Pupeteer Page
   * @param {string} obj.siteUrl A url to the index of the site
   */
  constructor({ page, siteUrl }) {
    super();
    this._page = page;
    this._siteUrl = siteUrl;
  }

  async gotoUniversalPage({ queryParams = '' } = {}) {
    const url = `${this._siteUrl}?${queryParams}`;
    await this._page.goto(url);
    await waitTillHTMLRendered(this._page);
  }

  async gotoVerticalPage({ vertical, queryParams = '' } = {}) {
    const url = `${this._siteUrl}/${vertical}?${queryParams}`;
    await this._page.goto(url);
    await waitTillHTMLRendered(this._page);
  }

  async click(selector) {
    await this._page.click(selector);
    await waitTillHTMLRendered(this._page);
  }
}

module.exports = StandardPhotographer;