ANSWERS.addComponent('ApplyFiltersButton', {
  container: '#js-answersApplyFiltersButton',
  ...{{{ json componentSettings.ApplyFiltersButton }}},
  onApply: function () {
    hideFilters();
    this.setState(this.getState());
  }
});

ANSWERS.addComponent('FilterPanelToggle', {
  container: '#js-answersFilterPanelToggle',
  ...{{{ json componentSettings.FilterPanelToggle }}},
  onClickResetFilters: function() {
    const filterNodes = ANSWERS.core.filterRegistry
      .getAllFilterNodes()
      .filter(fn => fn.getFilter().getFilterKey());
    filterNodes.forEach(node => {
      node.remove();
    });
    ANSWERS.core.verticalSearch(
      ANSWERS.core.globalStorage.getState('search-config').verticalKey,
      { useFacets: true }
    );
  },
  onClickChangeFilters: () => {
    showFilters();
  },
  onClickClearSearch: () => {
    const searchBarContainer = document.getElementById('js-answersSearchBar')
    if (!searchBarContainer) {
      return
    }
    ANSWERS.core.setQuery('');
    ANSWERS.core.persistentStorage.set('query', '');
    const searchInputEl = searchBarContainer.querySelector('.js-yext-query');
    searchInputEl.focus();
  }
});
