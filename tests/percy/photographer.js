/**
 * @typedef {import('./pagenavigator.js')} PageNavigator
 * @typedef {import('./Camera.js')} Camera
 */

/**
 * Responsible for determining which snapshots to take
 */
class Photographer {
  /**
   * @param {PageNavigator} pageNavigator
   * @param {Camera} camera
   */
  constructor(pageNavigator, camera) {
    this._pageNavigator = pageNavigator;
    this._camera = camera;
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

    await this._pageNavigator.gotoUniversalPage({ query: 'office sparce'});
    await this._camera.snapshot('universal-search--spellcheck');

    await this._pageNavigator.gotoUniversalPage({ query: 'what if i forget my password?'});
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

    await this._pageNavigator.gotoVerticalPage('events', { query: 'vrginia' });
    await this._camera.snapshot('vertical-search--spellcheck');

    await this._pageNavigator.gotoVerticalPage('financial_professionals', { query: 'connor' });
    await this._camera.snapshot('vertical-search--financial-professional-location');
    
    await this._pageNavigator.gotoVerticalPage('jobs', { query: 'job' });
    await this._camera.snapshot('vertical-search--job-standard');

    await this._pageNavigator.gotoVerticalPage('help_articles', { query: 'slap chop' });
    await this._camera.snapshot('vertical-search--document-standard');

    await this._pageNavigator.gotoVerticalPage('menu_items', { query: 'roll' });
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
    await this._pageNavigator.gotoUniversalPage({ query: 'bryan reed phone number' });
    await this._camera.snapshot('field-direct-answer');

    await this._pageNavigator.gotoUniversalPage({ query: 'where was joe exotic born?' });
    await this._camera.snapshot('documentsearch-direct-answer')

    await this._pageNavigator.gotoUniversalPage({ query: 'how to get rich text' });
    await this._camera.snapshot('documentsearch-rich-text-direct-answer')

    await this._pageNavigator.gotoUniversalPage({ query: 'who is howard?' });
    await this._camera.snapshot('documentsearch-rich-text-picture-direct-answer')
  }
}

module.exports = Photographer;
