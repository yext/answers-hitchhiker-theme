function hideFilters () {
  const filtersEl = document.getElementById('js-filtersView');
  const resultsEl = document.getElementById('js-resultsView');
  const facetsApplyEl = document.getElementById('js-answersApplyFiltersButton');
  filtersEl.style.display = 'none';
  resultsEl.style.display = '';
  facetsApplyEl.style.display = 'none';
  scrollToTop();
  ANSWERS.core.globalStorage.set('hh-filter-panel', {
    panelIsDisplayed: false
  });
}

function isNoResults () {
  const resultsContext = (ANSWERS.core.globalStorage.getState('vertical-results') || {}).resultsContext;
  return resultsContext === 'no-results';
}

function scrollToTop () {
  const resultsColumnEl = document.getElementById('js-resultsColumn');
  window.scroll({
    top: 0
  });
  resultsColumnEl.scrollTop = 0;
}

function showFilters() {
  const filtersEl = document.getElementById('js-filtersView');
  const resultsEl = document.getElementById('js-resultsView');
  const facetsApplyEl = document.getElementById('js-answersApplyFiltersButton');
  filtersEl.style.display = '';
  resultsEl.style.display = 'none';
  facetsApplyEl.style.display = '';
  scrollToTop();
  ANSWERS.core.globalStorage.set('hh-filter-panel', {
    panelIsDisplayed: true
  });
}