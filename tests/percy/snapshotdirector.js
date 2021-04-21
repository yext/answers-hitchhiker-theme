/**
 * @typedef {import('./Photographer.js')} Photographer
 * @typedef {import('./Camera.js')} Camera
 */

/**
 * Responsible for determining which snapshots to take
 */
class SnapshotDirector {
  /**
   * @param {Object} obj
   * @param {Photographer} obj.photographer 
   * @param {Camera} obj.camera
   */
  constructor({ photographer, camera }) {
    this._photographer = photographer;
    this._camera = camera;
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
    await this._camera.snapshot('homepage');
  }
  
  async _captureUniversalSearch () {
    await this._photographer.gotoUniversalPage({ queryParams: 'query=a' });
    await this._camera.snapshot('universal-search');

    await this._photographer.gotoUniversalPage({ queryParams: 'query=office+sparce'});
    await this._camera.snapshot('universal-search-spellcheck');
  }
  
  async _captureVerticalSearch () {
    await this._photographer.gotoVerticalPage({ vertical: 'events', queryParams: 'query=a'});
    await this._camera.snapshot('vertical-search');

    await this._photographer.gotoVerticalPage({ vertical: 'events', queryParams: 'query=vrginia'});
    await this._camera.snapshot('vertical-search-spellcheck');
  }
  
  async _captureVerticalGridSearch () {
    await this._photographer.gotoVerticalPage({ vertical: 'people', queryParams: 'query=a' });
    await this._camera.snapshot('vertical-grid-search');

    await this._photographer.gotoVerticalPage({ vertical: 'people', queryParams: 'query=vrginia'});
    await this._camera.snapshot('vertical-grid-search-spellcheck');
  }
  
  async _captureVerticalMapSearch () {
    await this._photographer.gotoVerticalPage({ vertical: 'locations', queryParams: 'query=a' });
    await this._camera.snapshot('vertical-map-search');
  }
  
  async _captureVerticalFullPageMapSearch () {
    await this._photographer.gotoVerticalPage({ vertical: 'locations_full_page_map', queryParams: 'query=' });
    await this._camera.snapshotDesktopOnly('vertical-full-page-map-desktop-view');
    await this._camera.snapshotMobileOnly('vertical-full-page-map-mobile-list-view');
  
    await this._photographer.click('.Answers-mobileToggle');
    await this._camera.snapshotMobileOnly('vertical-full-page-map-mobile-map-view');
  
    const mapboxPinSelector = '.js-answersMap button';
    await this._photographer.click(mapboxPinSelector);
    await this._camera.snapshotMobileOnly('vertical-full-page-map-mobile-detail-view');

    await this._photographer.gotoVerticalPage({ vertical: 'locations_full_page_map', queryParams: 'query=office+sparce'});
    await this._camera.snapshotDesktopOnly('vertical-full-page-map-desktop-view-spellcheck');
    await this._camera.snapshotMobileOnly('vertical-full-page-map-mobile-list-view-spellcheck');

    await this._photographer.gotoVerticalPage({ vertical: 'locations_full_page_map', queryParams: 'query=virginia' });
    await this._camera.snapshotDesktopOnly('vertical-full-page-map-desktop-view-nlp-filters');

    await this._photographer.gotoVerticalPage({ vertical: 'locations_full_page_map_with_filters', queryParams: 'query=virginia' });
    await this._camera.snapshotDesktopOnly('vertical-full-page-map-with-filters-desktop-view-nlp-filters');
  }
}

module.exports = SnapshotDirector;