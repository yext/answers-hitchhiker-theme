const DEFAULT_CONFIG = {
  changeFiltersText: 'sorts and filters',
  resetFiltersText: 'reset filters',
  clearSearchText: 'clear search'
}

class FilterPanelToggle extends ANSWERS.Component {
  constructor(config, systemConfig = {}) {
    super({ ...DEFAULT_CONFIG, ...config }, systemConfig);
    this.core.globalStorage.on('update', 'vertical-results', data => {
      if (data.searchState === 'search-complete') {
        this.setState();
      }
    });
    this.core.globalStorage.on('update', 'hh-filter-panel', data => {
      this.setState(data);
    });
    this.onClickClearSearch = this._config.onClickClearSearch || function() {};
    this.onClickClearSearch = this.onClickClearSearch.bind(this);
    this.onClickResetFilters = this._config.onClickResetFilters || function() {};
    this.onClickResetFilters = this.onClickResetFilters.bind(this);
    this.onClickChangeFilters = this._config.onClickChangeFilters || function() {};
    this.onClickChangeFilters = this.onClickChangeFilters.bind(this);
  }

  setState(data = {}) {
    const verticalResults = this.core.globalStorage.getState('vertical-results') || {};
    return super.setState({
      ...this.getState(),
      ...data,
      isPanelDisplayed: data.isPanelDisplayed || this.getState('isPanelDisplayed'),
      isNoResults: verticalResults.resultsContext === 'no-results',
      hasAppliedFilters: this.getAllFilterNodes().length > 0,
      searchComplete: verticalResults.searchState === 'search-complete'
    });
  }

  getAllFilterNodes () {
    return this.core.filterRegistry.getAllFilterNodes().filter(fn => fn.getFilter().getFilterKey());
  }

  onMount () {
    const changeFiltersEL = this._container.querySelector('.js-changeFilters')
    changeFiltersEL && changeFiltersEL.addEventListener('click', this.onClickChangeFilters);
    const resetFiltersEl = this._container.querySelector('.js-resetFilters')
    resetFiltersEl && resetFiltersEl.addEventListener('click', this.onClickResetFilters);
    const clearSearchEl = this._container.querySelector('.js-clearSearch')
    clearSearchEl && clearSearchEl.addEventListener('click', this.onClickClearSearch);
  }

  static get type() {
    return 'FilterPanelToggle';
  }

  static defaultTemplateName () {
    return 'collapsibleFilters/FilterPanelToggle';
  }
}

ANSWERS.registerTemplate(
  'collapsibleFilters/FilterPanelToggle',
  `{{{read 'collapsible-filters/filter-panel-toggle/template' }}}`
);
ANSWERS.registerComponentType(FilterPanelToggle);