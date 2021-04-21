const Photographer = require('./photographer');
const { waitTillHTMLRendered } = require('./utils');

/**
 * Responsible for navigating iframe answers experiences
 */
class IframePhotographer extends Photographer {
  /**
   * @param {Object} obj
   * @param {import('puppeteer').Page} obj.page A Pupeteer Page
   * @param {string} obj.siteUrl A url to the index of the site
   * @param {string} obj.iframePage The name of the iframe page
   */
  constructor({ page, siteUrl, iframePage }) {
    super();
    this._page = page;
    this._siteUrl = siteUrl;
    this._iframePage = iframePage;
  }

  async gotoUniversalPage({ queryParams = '' } = {}) {
    const url = `${this._siteUrl}/${this._iframePage}?${queryParams}`;
    await this._page.goto(url);
    await waitTillHTMLRendered(this._page);
  }

  async gotoVerticalPage({ vertical, queryParams = '' } = {}) {
    const url = `${this._siteUrl}/${this._iframePage}?verticalUrl=${vertical}&${queryParams}`;
    await this._page.goto(url);
    await waitTillHTMLRendered(this._page);
  }

  async click(selector) {
    const iframeElement = await this._page.$('iframe');
    const frame = await iframeElement.contentFrame();
    await frame.click(selector);
    await waitTillHTMLRendered(this._page);
  }
}

module.exports = IframePhotographer;