const PageNavigator = require('./pagenavigator');
const { waitTillHTMLRendered, getQueryParamsString } = require('./utils');

/**
 * Responsible for navigating answers experiences
 */
class StandardPageNavigator extends PageNavigator {
  /**
   * @param {import('puppeteer').Page} page A Pupeteer Page
   * @param {string} siteUrl A url to the index of the site
   * @param {string} defaultLocale default locale config of the site
   */
  constructor(page, siteUrl, defaultLocale='en') {
    super();
    this._page = page;
    this._siteUrl = siteUrl;
    this._defaultLocale = defaultLocale;
    this._localeUrlPath = '';
  }

  /**
   * Set locale param for the site's url
   * 
   * @param {string} locale 
   */
  setCurrentLocale(locale) {
    this._localeUrlPath = locale === this._defaultLocale? '' : '/' + locale;
  }

  async gotoUniversalPage(queryParams = {}) {
    const queryParamsString = getQueryParamsString(queryParams);
    const url = `${this._siteUrl}${this._localeUrlPath}?${queryParamsString}`;
    await this._page.goto(url);
    await waitTillHTMLRendered(this._page);
  }

  async gotoVerticalPage(vertical, queryParams = {}) {
    const queryParamsString = getQueryParamsString(queryParams);
    const url = `${this._siteUrl}${this._localeUrlPath}/${vertical}.html?${queryParamsString}`;
    await this._page.goto(url);
    await waitTillHTMLRendered(this._page);
  }

  async click(selector) {
    await this._page.click(selector);
    await waitTillHTMLRendered(this._page);
  }
}

module.exports = StandardPageNavigator;