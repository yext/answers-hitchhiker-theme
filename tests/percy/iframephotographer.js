const Photographer = require('./photographer');
const { waitTillHTMLRendered } = require('./utils');
const { SnapshotWidths } = require('./constants');

/**
 * Responsible for taking Percy snapshots of an iframe answers experience
 */
class IframePhotographer extends Photographer {
  /**
   * @param {Object} obj
   * @param {import('puppeteer').Page} obj.page A Pupeteer Page
   * @param {function} obj.percySnapshot The percy snapshot function
   * @param {string} obj.siteUrl A url to the index of the site
   */
  constructor({ page, percySnapshot, siteUrl, iframePage }) {
    super();
    this._page = page;
    this._percySnapshot = percySnapshot;
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

  async snapshot(snapshotName) {
    await this._percySnapshot(snapshotName + '-iframe');
  }

  async snapshotDesktopOnly(snapshotName) {
    await this._percySnapshot(snapshotName + '-iframe', { widths: [SnapshotWidths.Desktop] });
  }

  async snapshotMobileOnly(snapshotName) {
    await this._percySnapshot(snapshotName + '-iframe', { widths: [SnapshotWidths.Mobile] });
  }

  async click(selector) {
    const iframeElement = await this._page.$('iframe');
    const frame = await iframeElement.contentFrame();
    await frame.click(selector);
    await waitTillHTMLRendered(this._page);
  }
}

module.exports = IframePhotographer;