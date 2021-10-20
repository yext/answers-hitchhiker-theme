const { BrowserPageWidths } = require("../percy/constants");

class WcagReporter {
  /**
   * @param {PageNavigator} pageNavigator
   * @param {import('@axe-core/puppeteer')} analyzer
   * @param {import('puppeteer').Page} page
   */
  constructor (pageNavigator, analyzer, page) {
    this._pageNavigator = pageNavigator;
    this._analyzer = analyzer;
    this._page = page;
    this.results = [];
  }

  async analyze() {
    await this._analyzeUniversalSearch();
    // await this._analyzeVerticalSearch();
    // await this._analyzeVerticalGridSearch();
    // await this._analyzeVerticalMapSearch();
    // await this._analyzeVerticalFullPageMapSearch();
    // await this._analyzeDirectAnswers();
    return this.results;
  }


  async _analyzeUniversalSearch() {
    // await this._pageNavigator.gotoUniversalPage();
    // this.results.push(await this._analyzer.analyze());

    // await this._pageNavigator.gotoUniversalPage({ query: 'a' });
    // this.results.push(await this._analyzer.analyze());

    // await this._pageNavigator.gotoUniversalPage({ query: 'office sparce'});
    // this.results.push(await this._analyzer.analyze());

    await this._pageNavigator.gotoUniversalPage({ query: 'what if i forget my password?'});
    await this._page.waitForTimeout(10000);
    await this._pageNavigator.click('.HitchhikerFaqAccordion-toggle')
    this.results.push(await this._analyzer.analyze());

    // await this._pageNavigator.gotoUniversalPage({ query: 'yext answers'});
    // this.results.push(await this._analyzer.analyze());

  }

  async _analyzeVerticalSearch() {
    await this._pageNavigator.gotoVerticalPage('events');
    this.results.push(await this._analyzer.analyze());

    await this._pageNavigator.gotoVerticalPage('events', { query: 'a' });
    this.results.push(await this._analyzer.analyze());

    await this._pageNavigator.gotoVerticalPage('events', { query: 'vrginia' });
    this.results.push(await this._analyzer.analyze());

    await this._pageNavigator.gotoVerticalPage('events_custom_cta_icons');
    this.results.push(await this._analyzer.analyze());

    await this._pageNavigator.gotoVerticalPage('financial_professionals', { query: 'connor' });
    this.results.push(await this._analyzer.analyze());

    await this._pageNavigator.gotoVerticalPage('healthcare_professionals', { query: 'bob' });
    this.results.push(await this._analyzer.analyze());
    
    await this._pageNavigator.gotoVerticalPage('jobs', { query: 'job' });
    this.results.push(await this._analyzer.analyze());

    await this._pageNavigator.gotoVerticalPage('help_articles', { query: 'slap chop' });
    this.results.push(await this._analyzer.analyze());

    await this._pageNavigator.gotoVerticalPage('menu_items', { query: 'roll' });
    this.results.push(await this._analyzer.analyze());
  }

  async _analyzeVerticalGridSearch () {
    await this._pageNavigator.gotoVerticalPage('people', { query: 'a' });
    this.results.push(await this._analyzer.analyze());

    await this._pageNavigator.gotoVerticalPage('people', { query: 'vrginia' });
    this.results.push(await this._analyzer.analyze());

    await this._pageNavigator.gotoVerticalPage('products', { query: 'yext answers' });
    this.results.push(await this._analyzer.analyze());

    await this._pageNavigator.gotoVerticalPage('products_clickable_image', { query: 'yext answers' });
    this.results.push(await this._analyzer.analyze());
  }

  async _analyzeVerticalMapSearch () {
    await this._pageNavigator.gotoVerticalPage('locations', { query: 'a' });
    this.results.push(await this._analyzer.analyze());

    await this._pageNavigator.gotoVerticalPage('locations_google', { query: 'virginia' });
    this.results.push(await this._analyzer.analyze());
  }

  async _analyzeVerticalFullPageMapSearch () {
    await this._pageNavigator
      .gotoVerticalPage('locations_full_page_map', { query: '' });
    this.results.push(await this._analyzer.analyze());
    
    await this._page.setViewport({ width: BrowserPageWidths.Mobile, height: this._page.viewport().height });
    this.results.push(await this._analyzer.analyze());

    await this._pageNavigator.click('.Answers-mobileToggle');
    this.results.push(await this._analyzer.analyze());
  
    const mapboxPinSelector = '.js-answersMap button';
    await this._pageNavigator.click(mapboxPinSelector);
    this.results.push(await this._analyzer.analyze());

    await this._pageNavigator
      .gotoVerticalPage('locations_full_page_map', { query: 'office sparce'});
    this.results.push(await this._analyzer.analyze());
      
    await this._page.setViewport({ width: BrowserPageWidths.Desktop, height: this._page.viewport().height });
    this.results.push(await this._analyzer.analyze());
    
    await this._pageNavigator
      .gotoVerticalPage('locations_full_page_map', { query: 'virginia' });
    this.results.push(await this._analyzer.analyze());

    await this._pageNavigator
      .gotoVerticalPage('locations_full_page_map_with_filters', { query: 'people' });
    this.results.push(await this._analyzer.analyze());

    await this._pageNavigator
      .gotoVerticalPage('locations_full_page_map_with_filters', { query: 'virginia' });
    this.results.push(await this._analyzer.analyze());
  }

  async _analyzeDirectAnswers () {
    await this._pageNavigator.gotoUniversalPage({ query: 'bryan reed phone number' });
    this.results.push(await this._analyzer.analyze());

    await this._pageNavigator.gotoUniversalPage({ query: 'where was joe exotic born?' });
    this.results.push(await this._analyzer.analyze());

    await this._pageNavigator.gotoUniversalPage({ query: 'how to get rich text' });
    this.results.push(await this._analyzer.analyze());

    await this._pageNavigator.gotoUniversalPage({ query: 'who is howard?' });
    this.results.push(await this._analyzer.analyze());
  }
}

module.exports = WcagReporter;
