const DEFAULT_CONFIG = {
  changeFiltersText: 'sorts and filters',
  resetFiltersText: 'reset filters',
  clearSearchText: 'clear search',
  onClickClearSearch: function() {},
  onClickResetFilters: function() {},
  onClickChangeFilters: function() {}
};

/**
 * FilterLink is a button used for displaying different text depending on the
 * collapsible filters state. The behavior on click is determined by config
 * passed into the component.
 */
class FilterLink extends ANSWERS.Component {
  constructor(config, systemConfig = {}) {
    super({ ...DEFAULT_CONFIG, ...config }, systemConfig);
    this.core.globalStorage.on('update', 'vertical-results', data => {
      if (data.searchState === 'search-complete') {
        this.setState();
      }
    });
    this.onClickClearSearch = this._config.onClickClearSearch.bind(this);
    this.onClickResetFilters = this._config.onClickResetFilters.bind(this);
    this.onClickChangeFilters = this._config.onClickChangeFilters.bind(this);
  }

  setState(data = {}) {
    const verticalResults = this.core.globalStorage.getState('vertical-results') || {};
    return super.setState({
      ...this.getState(),
      ...data,
      isPanelDisplayed: data.isPanelDisplayed || this.getState('isPanelDisplayed'),
      isNoResults: verticalResults.resultsContext === 'no-results',
      hasAppliedFilters: this.getAllFilterNodes().length > 0
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
    return 'FilterLink';
  }

  static defaultTemplateName () {
    return 'collapsibleFilters/FilterLink';
  }
}

ANSWERS.registerTemplate(
  'collapsibleFilters/FilterLink',
  `{{{read 'theme-components/collapsible-filters/filter-link/template' }}}`
);
ANSWERS.registerComponentType(FilterLink);