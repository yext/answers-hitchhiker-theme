const PageNavigator = require('./pagenavigator');
const { waitTillHTMLRendered, getQueryParamsString } = require('./utils');

/**
 * Responsible for navigating iframe answers experiences
 */
class IframePageNavigator extends PageNavigator {
  /**
   * @param {import('puppeteer').Page} page A Pupeteer Page
   * @param {string} siteUrl A url to the index of the site
   * @param {string} iframePage The name of the iframe page
   * @param {string} defaultLocale default locale config of the site
   */
  constructor(page, siteUrl, iframePage, defaultLocale='en') {
    super();
    this._page = page;
    this._siteUrl = siteUrl;
    this._iframePage = iframePage;
    this._defaultLocale = defaultLocale;
    this._localeUrlPath = '';
  }
  
  /**
   * Set locale for the site
   * 
   * @param {string} locale 
   */
  setCurrentLocale(locale) {
    this._localeUrlPath = locale === this.defaultLocale? '' : '/' + locale;
  }

  async gotoUniversalPage(queryParams = {}) {
    const queryParamsString = getQueryParamsString(queryParams);
    const url = `${this._siteUrl}${this._localeUrlPath}/${this._iframePage}.html?${queryParamsString}`;
    await this._page.goto(url);
    await waitTillHTMLRendered(this._page);
  }

  async gotoVerticalPage(vertical, queryParams = {}) {
    const queryParamsString = getQueryParamsString(queryParams);
    const url = `${this._siteUrl}${this._localeUrlPath}/${this._iframePage}.html?verticalUrl=${vertical}.html&${queryParamsString}`;
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

module.exports = IframePageNavigator;