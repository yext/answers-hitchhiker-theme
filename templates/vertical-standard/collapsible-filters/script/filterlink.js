ANSWERS.addComponent('FilterLink', {
  container: '#js-answersFilterLink',
  onClickResetFilters: function() {
    CollapsibleFilters.Helpers.resetAllFilters();
    CollapsibleFilters.Helpers.verticalSearch({ useFacets: true });
  },
  onClickChangeFilters: () => {
    collapsibleFiltersInteractions.expandFilters();
  },
  onClickClearSearch: () => {
    CollapsibleFilters.Helpers.clearSearch();
    collapsibleFiltersInteractions.focusSearchBar();
  },
  onCreate: () => {
    const moveFiltersWrapper = (containerClassName) => {
      const containerEl = document.getElementsByClassName(containerClassName)?.[0];
      const filtersWrapperEl = document.getElementsByClassName('js-answersFiltersWrapper')?.[0];
      if (containerEl && filtersWrapperEl) {
        containerEl.appendChild(filtersWrapperEl);
      }
    }
    if (collapsibleFiltersInteractions.isCollapsibleFiltersView()) {
      moveFiltersWrapper('Answers-resultsMidContainer');
    }
    collapsibleFiltersInteractions.addExpandedFiltersListener(isExpanded => {
      if (isExpanded) {
        moveFiltersWrapper('Answers-resultsLeftContainer');
      } else {
        moveFiltersWrapper('Answers-resultsMidContainer');
      }
    });
  },
  ...{{{ json componentSettings.FilterLink }}}
});