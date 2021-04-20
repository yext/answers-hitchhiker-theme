const Photographer = require('./photographer');
const { waitTillHTMLRendered } = require('./utils');

class StandardPhotographer extends Photographer {
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
    await this._percySnapshot(snapshotName, { widths: [1280] });
  }

  async snapshotMobileOnly(snapshotName) {
    await this._percySnapshot(snapshotName, { widths: [375] });
  }

  async click(selector) {
    await this._page.click(selector);
    await waitTillHTMLRendered(this._page);
  }
}

module.exports = StandardPhotographer;