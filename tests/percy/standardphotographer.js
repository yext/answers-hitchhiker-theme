const Photographer = require('./photographer');
const { waitTillHTMLRendered } = require('./utils');
const { SnapshotWidths } = require('./constants');

/**
 * Responsible for taking Percy snapshots of an answers experience
 */
class StandardPhotographer extends Photographer {
  /**
   * @param {Object} obj
   * @param {import('puppeteer').Page} obj.page A Pupeteer Page
   * @param {function} obj.percySnapshot The percy snapshot function
   * @param {string} obj.siteUrl A url to the index of the site
   */
  constructor({ page, percySnapshot, siteUrl }) {
    super();
    this._page = page;
    this._percySnapshot = percySnapshot;
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

  async snapshot(snapshotName) {
    await this._percySnapshot(snapshotName);
  }

  async snapshotDesktopOnly(snapshotName) {
    await this._percySnapshot(snapshotName, { widths: [SnapshotWidths.Desktop] });
  }

  async snapshotMobileOnly(snapshotName) {
    await this._percySnapshot(snapshotName, { widths: [SnapshotWidths.Mobile] });
  }

  async click(selector) {
    await this._page.click(selector);
    await waitTillHTMLRendered(this._page);
  }
}

module.exports = StandardPhotographer;