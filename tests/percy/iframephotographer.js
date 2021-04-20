const Photographer = require('./photographer');
const { waitTillHTMLRendered } = require('./utils');

class IframePhotographer extends Photographer {
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
    await this._percySnapshot(snapshotName + '-iframe', { widths: [1280] });
  }

  async snapshotMobileOnly(snapshotName) {
    await this._percySnapshot(snapshotName + '-iframe', { widths: [375] });
  }

  async click(selector) {
    const iframeElement = await this._page.$('iframe');
    const frame = await iframeElement.contentFrame();
    await frame.click(selector);
    await waitTillHTMLRendered(this._page);
  }
}

module.exports = IframePhotographer;