function clearFacetsPersistentStorage(prefix='Facets') {
  for (const urlParamKey in ANSWERS.core.persistentStorage.getAll()) {
    if (urlParamKey.startsWith(prefix)) {
      ANSWERS.core.persistentStorage.delete(urlParamKey, true)
    }
  }
}

function scrollDown (distance) {
  const resultsColumnEl = document.getElementById('js-resultsColumn');
  resultsColumnEl.scrollTop = resultsColumnEl.scrollTop + distance;
  window.scroll({
    top: window.scrollY + distance
  });
}

let previousTop = 0;
let previousFacetLabel;

ANSWERS.addComponent('Facets', {
  container: '#js-answersFacets',
  {{#if verticalKey}}
    verticalKey: '{{{verticalKey}}}',
  {{/if}}
  ...{{{ json componentSettings.Facets }}},
  onCreate: function () {
    ANSWERS.core.globalStorage.on('update', 'vertical-results', data => {
      const inputEls =
        this._container.getElementsByClassName('js-yext-filter-option');
      const disabled = data.searchState === 'search-loading';
      for (const input of inputEls) {
        input.disabled = disabled;
      }
    });
  },
  onMount: function () {
    ANSWERS.core.globalStorage.set('facets-on-mount', 'update');

    const facetGroupEls = this._container.querySelectorAll('.yxt-FilterOptions-fieldSet') || [];
    for (const facetGroupEl of facetGroupEls) {
      facetGroupEl.addEventListener('click', e => {
        previousTop = facetGroupEl.getBoundingClientRect().top;
        previousFacetLabel = facetGroupEl.dataset.label;
      });
    }

    const facetGroupEl = previousFacetLabel && this._container.querySelector(`.yxt-FilterOptions-fieldSet[data-label="${previousFacetLabel}"]`);
    if (facetGroupEl) {
      const downwardScrollNeeded = facetGroupEl.getBoundingClientRect().top - previousTop;
      scrollDown(downwardScrollNeeded);
    }
    previousFacetLabel = null;
  },
  transformData: data => {
    clearFacetsPersistentStorage();
    return data;
  }
});