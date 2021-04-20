/**
 * @typedef {import('./Photographer.js')} Photographer
 */

/**
 * Responsible for determining which snapshots to take
 */
class SnapshotDirector {
  /**
   * @param {Photographer} photographer 
   */
  constructor(photographer) {
    this._photographer = photographer;
  }

  /**
   * @param {Photographer} photographer 
   */
  setPhotographer(photographer) {
    this._photographer = photographer;
  }

  async direct() {
    await this._captureHomepage();
    await this._captureUniversalSearch();
    await this._captureVerticalSearch();
    await this._captureVerticalGridSearch();
    await this._captureVerticalMapSearch();
    await this._captureVerticalFullPageMapSearch();
  }

  async _captureHomepage () {
    await this._photographer.gotoUniversalPage();
    await this._photographer.snapshot('homepage');
  }
  
  async _captureUniversalSearch () {
    await this._photographer.gotoUniversalPage({ queryParams: 'query=a' });
    await this._photographer.snapshot('universal-search');
  }
  
  async _captureVerticalSearch () {
    await this._photographer.gotoVerticalPage({ vertical: 'events', queryParams: 'query=a'});
    await this._photographer.snapshot('vertical-search');
  }
  
  async _captureVerticalGridSearch () {
    await this._photographer.gotoVerticalPage({ vertical: 'people', queryParams: 'query=a' });
    await this._photographer.snapshot('vertical-grid-search');
  }
  
  async _captureVerticalMapSearch () {
    await this._photographer.gotoVerticalPage({ vertical: 'locations', queryParams: 'query=a' });
    await this._photographer.snapshot('vertical-map-search');
  }
  
  async _captureVerticalFullPageMapSearch () {
    await this._photographer.gotoVerticalPage({ vertical: 'locations_full_page_map', queryParams: 'query=' });
    await this._photographer.snapshotDesktopOnly('vertical-full-page-map-desktop-view');
    await this._photographer.snapshotMobileOnly('vertical-full-page-map-mobile-list-view');
  
    await this._photographer.click('.Answers-mobileToggle');
    await this._photographer.snapshotMobileOnly('vertical-full-page-map-mobile-map-view');
  
    const mapboxPinSelector = '.js-answersMap button';
    await this._photographer.click(mapboxPinSelector);
    await this._photographer.snapshotMobileOnly('vertical-full-page-map-mobile-detail-view');
  }
}

module.exports = SnapshotDirector;