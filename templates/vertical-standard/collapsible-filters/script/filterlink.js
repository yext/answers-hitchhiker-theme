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
      document.getElementsByClassName(containerClassName)[0].appendChild(
        document.getElementsByClassName('js-answersFiltersWrapper')[0]
      );
    }
    if (collapsibleFiltersInteractions.isCollapsibleFiltersView()) {
      moveFiltersWrapper('Answers-resultsMidContainer');
    }
    collapsibleFiltersInteractions.setListenerOnExpandedFiltersBreakpoint((e) => {
      if (e.matches) {
        moveFiltersWrapper('Answers-resultsLeftContainer');
      } else {
        moveFiltersWrapper('Answers-resultsMidContainer');
      }
    });
  },
  ...{{{ json componentSettings.FilterLink }}}
});