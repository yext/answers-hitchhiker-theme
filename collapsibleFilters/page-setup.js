function hideFiltersOnSearchbarSearch () {
  let pendingQueryUpdate = false;

  ANSWERS.core.globalStorage.on('update', 'query', () => {
    pendingQueryUpdate = true;
  });
  
  ANSWERS.core.globalStorage.on('update', 'vertical-results', verticalResults => {
    if (verticalResults.searchState !== 'search-complete' || !pendingQueryUpdate) {
      return;
    }
    hideFilters();
    pendingQueryUpdate = false;
  });
}

hideFiltersOnSearchbarSearch();
