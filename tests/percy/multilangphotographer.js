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
     */
    constructor(pageNavigator, camera, locale) {
      this._pageNavigator = pageNavigator;
      this._camera = camera;
      this._locale = locale;
      this._queries = {};
    }
  
    async captureSnapshots() {
      switch (this._locale) {
        case 'es':
           this._queries = {
            faq: '¿Qué pasa si olvidé mi contraseña?',
            job: 'trabajo',
            menu_item: 'rollo'
          }
        default:
          this._queries = {
            faq: 'what if i forgot my password?',
            job: 'job',
            menu_item: 'roll'
          }
      }
      await this._captureUniversalSearch();
      await this._captureVerticalSearch();
      await this._captureVerticalGridSearch();
      await this._captureVerticalMapSearch();
      await this._captureVerticalFullPageMapSearch();
    }
  
    async _captureUniversalSearch () {
      await this._pageNavigator.gotoUniversalPage();
      await this._camera.snapshot(this._locale + '--universal-search');
  
      await this._pageNavigator.gotoUniversalPage({ query: 'a' });
      await this._camera.snapshot(this._locale + '--universal-search--no-results');

      await this._pageNavigator.gotoUniversalPage({ query: 'yext answers'});
      await this._camera.snapshot(this._locale + '--universal-search--product-prominentimage');

      await this._pageNavigator.gotoUniversalPage({ query: this._queries.faq});
      await this._pageNavigator.click('.HitchhikerFaqAccordion-toggle')
      await this._camera.snapshot(this._locale + '--universal-search--faq-accordion');
    }

    async _captureVerticalSearch () {
      await this._pageNavigator.gotoVerticalPage('events');
      await this._camera.snapshot(this._locale + '--vertical-search');
  
      await this._pageNavigator.gotoVerticalPage('events', { query: 'a' });
      await this._camera.snapshot(this._locale + '--vertical-search--no-results');
  
      await this._pageNavigator.gotoVerticalPage('financial_professionals', { query: 'connor' });
      await this._camera.snapshot(this._locale + '--vertical-search--financial-professional-location');
      
      await this._pageNavigator.gotoVerticalPage('jobs', { query: this._queries.job });
      await this._camera.snapshot(this._locale + '--vertical-search--job-standard');
  
      await this._pageNavigator.gotoVerticalPage('help_articles', { query: 'slap chop' });
      await this._camera.snapshot(this._locale + '--vertical-search--document-standard');
  
      await this._pageNavigator.gotoVerticalPage('menu_items', { query: this._queries.menu_item });
      await this._camera.snapshot(this._locale + '--vertical-search--menuitem-standard');
    }
    
    async _captureVerticalGridSearch () {
      await this._pageNavigator.gotoVerticalPage('people', { query: 'a' });
      await this._camera.snapshot(this._locale + '--vertical-grid-search');
  
      await this._pageNavigator.gotoVerticalPage('people', { query: 'vrginia' });
      await this._camera.snapshot(this._locale + '--vertical-grid-search--spellcheck');
  
      await this._pageNavigator.gotoVerticalPage('products', { query: 'yext answers' });
      await this._camera.snapshot(this._locale + '--vertical-grid-search--product-prominentvideo');
  
      await this._pageNavigator.gotoVerticalPage('products_clickable_image', { query: 'yext answers' });
      await this._camera.snapshot(this._locale + '--vertical-grid-search--product-prominentimage-clickable');
    }
    
    async _captureVerticalMapSearch () {
      await this._pageNavigator.gotoVerticalPage('locations', { query: 'a' });
      await this._camera.snapshot(this._locale + '--vertical-map-search');
  
      await this._pageNavigator.gotoVerticalPage('locations_google', { query: 'virginia' });
      await this._camera.snapshot(this._locale + '--vertical-map-search--google');
    }
  
    async _captureVerticalFullPageMapSearch () {
      await this._pageNavigator
        .gotoVerticalPage('locations_full_page_map', { query: '' });
      await this._camera.snapshotDesktopOnly(this._locale + '--vertical-full-page-map__desktop-view');
      await this._camera.snapshotMobileOnly(this._locale + '--vertical-full-page-map__mobile-list-view');
    
      await this._pageNavigator.click('.Answers-mobileToggle');
      await this._camera.snapshotMobileOnly(this._locale + '--vertical-full-page-map__mobile-map-view');
    
      const mapboxPinSelector = '.js-answersMap button';
      await this._pageNavigator.click(mapboxPinSelector);
      await this._camera.snapshotMobileOnly(this._locale + '--vertical-full-page-map__mobile-detail-view');
  
      await this._pageNavigator
        .gotoVerticalPage('locations_full_page_map', { query: 'office sparce'});
      await this._camera.snapshotDesktopOnly(this._locale + '--vertical-full-page-map--spellcheck__desktop-view');
      await this._camera.snapshotMobileOnly(this._locale + '--vertical-full-page-map--spellcheck__mobile-list-view');
  
      await this._pageNavigator
        .gotoVerticalPage('locations_full_page_map', { query: 'virginia' });
      await this._camera.snapshotDesktopOnly(this._locale + '--vertical-full-page-map--nlp-filters__desktop-view');
  
      await this._pageNavigator
        .gotoVerticalPage('locations_full_page_map_with_filters', { query: 'virginia' });
      await this._camera.snapshotDesktopOnly(this._locale + '--vertical-full-page-map-with-filters--nlp-filters__desktop-view');
    }
  }
  
  module.exports = MultilangPhotographer;