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
   * @param {locale} locate locate set for the site when taking snapshot
   */
  constructor(pageNavigator, camera, locale) {
    this._pageNavigator = pageNavigator;
    this._camera = camera;
    this._locale = locale;

    /**
     * Custom queries for specific locale
     * 
     * @type {Object<string, string>}
     */
    this._queries = {};

    /**
     * Locale tag to add to snapshot name
     * 
     * @type {string}
     */
    this.localeSnapshotTag = '';

    this.setLocale(locale);
  }

  /**
   * Sets locale for the page navigation and snapshot tag
   * 
   * @param {string} locale locale of the site
   */
  setLocale(locale) {
    this._locale = locale;
    this.localeSnapshotTag = this._locale === 'en'? '' : this._locale + '--';
    this._setLocaleQueries();
  }

  /**
   * Sets custom queries based on locale
   */
  _setLocaleQueries() {
    switch (this._locale) {
      case 'es':
        this._queries = {
          faq: '¿Qué pasa si olvidé mi contraseña?',
          job: 'trabajo',
          menu_item: 'rollo'
        }
        break;
      default:
        this._queries = {
          faq: 'what if i forgot my password?',
          job: 'job',
          menu_item: 'roll'
        }
    }
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
    await this._camera.snapshot(this.localeSnapshotTag + 'universal-search');

    await this._pageNavigator.gotoUniversalPage({ query: 'a' });
    await this._camera.snapshot(this.localeSnapshotTag + 'universal-search--no-results');

    await this._pageNavigator.gotoUniversalPage({ query: this._queries.faq });
    await this._pageNavigator.click('.HitchhikerFaqAccordion-toggle')
    await this._camera.snapshot(this.localeSnapshotTag + 'universal-search--faq-accordion');

    await this._pageNavigator.gotoUniversalPage({ query: 'yext answers'});
    await this._camera.snapshot(this.localeSnapshotTag + 'universal-search--product-prominentimage');
  }

  async _captureVerticalSearch () {
    await this._pageNavigator.gotoVerticalPage('events');
    await this._camera.snapshot(this.localeSnapshotTag + 'vertical-search');

    await this._pageNavigator.gotoVerticalPage('events', { query: 'a' });
    await this._camera.snapshot(this.localeSnapshotTag + 'vertical-search--no-results');

    await this._pageNavigator.gotoVerticalPage('financial_professionals', { query: 'connor' });
    await this._camera.snapshot(this.localeSnapshotTag + 'vertical-search--financial-professional-location');
    
    await this._pageNavigator.gotoVerticalPage('jobs', { query: this._queries.job });
    await this._camera.snapshot(this.localeSnapshotTag + 'vertical-search--job-standard');

    await this._pageNavigator.gotoVerticalPage('help_articles', { query: 'slap chop' });
    await this._camera.snapshot(this.localeSnapshotTag + 'vertical-search--document-standard');

    await this._pageNavigator.gotoVerticalPage('menu_items', { query: this._queries.menu_item });
    await this._camera.snapshot(this.localeSnapshotTag + 'vertical-search--menuitem-standard');
  }
  
  async _captureVerticalGridSearch () {
    await this._pageNavigator.gotoVerticalPage('people', { query: 'a' });
    await this._camera.snapshot(this.localeSnapshotTag + 'vertical-grid-search');

    await this._pageNavigator.gotoVerticalPage('people', { query: 'vrginia' });
    await this._camera.snapshot(this.localeSnapshotTag + 'vertical-grid-search--spellcheck');

    await this._pageNavigator.gotoVerticalPage('products', { query: 'yext answers' });
    await this._camera.snapshot('vertical-grid-search--product-prominentvideo');

    await this._pageNavigator.gotoVerticalPage('products_clickable_image', { query: 'yext answers' });
    await this._camera.snapshot(this.localeSnapshotTag + 'vertical-grid-search--product-prominentimage-clickable');
  }
  
  async _captureVerticalMapSearch () {
    await this._pageNavigator.gotoVerticalPage('locations', { query: 'a' });
    await this._camera.snapshot(this.localeSnapshotTag + 'vertical-map-search');

    await this._pageNavigator.gotoVerticalPage('locations_google', { query: 'virginia' });
    await this._camera.snapshot(this.localeSnapshotTag + 'vertical-map-search--google');
  }

  async _captureVerticalFullPageMapSearch () {
    await this._pageNavigator
      .gotoVerticalPage('locations_full_page_map', { query: '' });
    await this._camera.snapshotDesktopOnly(this.localeSnapshotTag + 'vertical-full-page-map__desktop-view');
    await this._camera.snapshotMobileOnly(this.localeSnapshotTag + 'vertical-full-page-map__mobile-list-view');
  
    await this._pageNavigator.click('.Answers-mobileToggle');
    await this._camera.snapshotMobileOnly(this.localeSnapshotTag + 'vertical-full-page-map__mobile-map-view');
  
    const mapboxPinSelector = '.js-answersMap button';
    await this._pageNavigator.click(mapboxPinSelector);
    await this._camera.snapshotMobileOnly(this.localeSnapshotTag + 'vertical-full-page-map__mobile-detail-view');

    await this._pageNavigator
      .gotoVerticalPage('locations_full_page_map', { query: 'office sparce'});
    await this._camera.snapshotDesktopOnly(this.localeSnapshotTag + 'vertical-full-page-map--spellcheck__desktop-view');
    await this._camera.snapshotMobileOnly(this.localeSnapshotTag + 'vertical-full-page-map--spellcheck__mobile-list-view');

    await this._pageNavigator
      .gotoVerticalPage('locations_full_page_map', { query: 'virginia' });
    await this._camera.snapshotDesktopOnly(this.localeSnapshotTag + 'vertical-full-page-map--nlp-filters__desktop-view');

    await this._pageNavigator
      .gotoVerticalPage('locations_full_page_map_with_filters', { query: 'virginia' });
    await this._camera.snapshotDesktopOnly(this.localeSnapshotTag + 'vertical-full-page-map-with-filters--nlp-filters__desktop-view');
  }

  async _captureDirectAnswers () {
    await this._pageNavigator.gotoUniversalPage({ query: 'bryan reed phone number' });
    await this._camera.snapshot(this.localeSnapshotTag + 'field-direct-answer');

    await this._pageNavigator.gotoUniversalPage({ query: 'where was joe exotic born?' });
    await this._camera.snapshot(this.localeSnapshotTag + 'documentsearch-direct-answer')
  }
}
  
module.exports = MultilangPhotographer;
