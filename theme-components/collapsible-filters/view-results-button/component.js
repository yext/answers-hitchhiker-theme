const DEFAULT_VIEW_RESULTS_BUTTON_CONFIG = {
  onClick: function() {}
};

/**
 * ViewResultsButton is a button, designed for CollapsibleFilters, that
 * allows you to collapse the filters view. The implementation of what
 * "collapse the filters view" means is passed in as the onClick config.
 */
class ViewResultsButton extends ANSWERS.Component {
  constructor(config = {}, systemConfig = {}) {
    super({ ...DEFAULT_VIEW_RESULTS_BUTTON_CONFIG, ...config }, systemConfig);
    this.core.globalStorage.on('update', 'vertical-results', data => {
      if (data.searchState === 'search-complete') {
        this.setState(data);
      }
    });
  }

  onMount () {
    const buttonEl = this._container.querySelector('.Hitchhiker-ViewResultsButton');
    buttonEl && buttonEl.addEventListener('click', () => {
      this._config.onClick.bind(this)();
    });
  }

  setState (data = {}) {
    return super.setState({
      ...this.getState(),
      ...data,
      isNoResults: data.resultsContext === 'no-results',
      verticalKey: this.core.globalStorage.getState('search-config').verticalKey
    });
  }

  static get type() {
    return 'ViewResultsButton';
  }

  static defaultTemplateName () {
    return 'collapsibleFilters/ViewResultsButton';
  }
}
ANSWERS.registerTemplate(
  'collapsibleFilters/ViewResultsButton',
  {{{stringifyPartial (read 'theme-components/collapsible-filters/view-results-button/template') }}}
);
ANSWERS.registerComponentType(ViewResultsButton);
