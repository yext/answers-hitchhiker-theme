/**
 * @typedef {import('./pagenavigator.js')} PageNavigator
 * @typedef {import('./Camera.js')} Camera
 */

/**
 * Responsible for determining which snapshots to take for specific locale
 */
class MultilangPhotographer {
  /**
   * @param {PageNavigator} pageNavigator
   * @param {Camera} camera
   * @param {Object<string, string>} queries custom queries for specific locale
   */
  constructor(pageNavigator, camera, queries) {
    this._pageNavigator = pageNavigator;
    this._camera = camera;
    this._queries = queries;
  }

  /**
   * Sets custom queries based on locale
   * 
   * @param {Object<string, string>} queries
   */
  setLocaleQueries(queries) {
    this._queries = queries;
  }

  async captureSnapshots() {
    await this._captureUniversalSearch();
    await this._captureVerticalSearch();
    await this._captureVerticalGridSearch();
    await this._captureVerticalMapSearch();
    await this._captureVerticalFullPageMapSearch();
    await this._captureDirectAnswers();
  }

  async _captureUniversalSearch () {
    await this._pageNavigator.gotoUniversalPage();
    await this._camera.snapshot('universal-search');

    await this._pageNavigator.gotoUniversalPage({ query: 'a' });
    await this._camera.snapshot('universal-search--no-results');

    await this._pageNavigator.gotoUniversalPage({ query: this._queries.faq });
    await this._pageNavigator.click('.HitchhikerFaqAccordion-toggle')
    await this._camera.snapshot('universal-search--faq-accordion');

    await this._pageNavigator.gotoUniversalPage({ query: 'yext answers'});
    await this._camera.snapshot('universal-search--product-prominentimage');
  }

  async _captureVerticalSearch () {
    await this._pageNavigator.gotoVerticalPage('events');
    await this._camera.snapshot('vertical-search');

    await this._pageNavigator.gotoVerticalPage('events', { query: 'a' });
    await this._camera.snapshot('vertical-search--no-results');

    await this._pageNavigator.gotoVerticalPage('financial_professionals', { query: 'connor' });
    await this._camera.snapshot('vertical-search--financial-professional-location');
    
    await this._pageNavigator.gotoVerticalPage('jobs', { query: this._queries.job });
    await this._camera.snapshot('vertical-search--job-standard');

    await this._pageNavigator.gotoVerticalPage('help_articles', { query: 'slap chop' });
    await this._camera.snapshot('vertical-search--document-standard');

    await this._pageNavigator.gotoVerticalPage('menu_items', { query: this._queries.menu_item });
    await this._camera.snapshot('vertical-search--menuitem-standard');
  }
  
  async _captureVerticalGridSearch () {
    await this._pageNavigator.gotoVerticalPage('people', { query: 'a' });
    await this._camera.snapshot('vertical-grid-search');

    await this._pageNavigator.gotoVerticalPage('people', { query: 'vrginia' });
    await this._camera.snapshot('vertical-grid-search--spellcheck');

    await this._pageNavigator.gotoVerticalPage('products', { query: 'yext answers' });
    await this._camera.snapshot('vertical-grid-search--product-prominentvideo');

    await this._pageNavigator.gotoVerticalPage('products_clickable_image', { query: 'yext answers' });
    await this._camera.snapshot('vertical-grid-search--product-prominentimage-clickable');
  }
  
  async _captureVerticalMapSearch () {
    await this._pageNavigator.gotoVerticalPage('locations', { query: 'a' });
    await this._camera.snapshot('vertical-map-search');

    await this._pageNavigator.gotoVerticalPage('locations_google', { query: 'virginia' });
    await this._camera.snapshot('vertical-map-search--google');
  }

  async _captureVerticalFullPageMapSearch () {
    await this._pageNavigator
      .gotoVerticalPage('locations_full_page_map', { query: '' });
    await this._camera.snapshotDesktopOnly('vertical-full-page-map__desktop-view');
    await this._camera.snapshotMobileOnly('vertical-full-page-map__mobile-list-view');
  
    await this._pageNavigator.click('.Answers-mobileToggle');
    await this._camera.snapshotMobileOnly('vertical-full-page-map__mobile-map-view');
  
    const mapboxPinSelector = '.js-answersMap button';
    await this._pageNavigator.click(mapboxPinSelector);
    await this._camera.snapshotMobileOnly('vertical-full-page-map__mobile-detail-view');

    await this._pageNavigator
      .gotoVerticalPage('locations_full_page_map', { query: 'office sparce'});
    await this._camera.snapshotDesktopOnly('vertical-full-page-map--spellcheck__desktop-view');
    await this._camera.snapshotMobileOnly('vertical-full-page-map--spellcheck__mobile-list-view');

    await this._pageNavigator
      .gotoVerticalPage('locations_full_page_map', { query: 'virginia' });
    await this._camera.snapshotDesktopOnly('vertical-full-page-map--nlp-filters__desktop-view');

    await this._pageNavigator
      .gotoVerticalPage('locations_full_page_map_with_filters', { query: 'virginia' });
    await this._camera.snapshotDesktopOnly('vertical-full-page-map-with-filters--nlp-filters__desktop-view');
  }

  async _captureDirectAnswers () {
    await this._pageNavigator.gotoUniversalPage({ query: this._queries.field_direct_answers });
    await this._camera.snapshot('field-direct-answer');
  }
}
  
module.exports = MultilangPhotographer;
