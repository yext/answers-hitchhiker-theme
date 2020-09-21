/**
 * Hide the filters view, and display the results view.
 */
function hideFilters () {
  const filtersEl = document.getElementById('js-filtersView');
  const resultsEl = document.getElementById('js-resultsView');
  const applyFiltersEl = document
    .getElementById('js-answersApplyFiltersButton');
  filtersEl.style.display = 'none';
  resultsEl.style.display = '';
  applyFiltersEl.style.display = 'none';
  scrollToTop();
  ANSWERS.core.globalStorage.set('hh-filter-panel', {
    panelIsDisplayed: false
  });
}

/**
 * Hide the results view, and display the filters view.
 */
function showFilters() {
  const filtersEl = document.getElementById('js-filtersView');
  const resultsEl = document.getElementById('js-resultsView');
  const applyFiltersEl = document
    .getElementById('js-answersApplyFiltersButton');
  filtersEl.style.display = '';
  resultsEl.style.display = 'none';
  applyFiltersEl.style.display = '';
  scrollToTop();
  ANSWERS.core.globalStorage.set('hh-filter-panel', {
    panelIsDisplayed: true
  });
}

/**
 * Whether the page is currently in a 'no-results' state.
 * @returns {boolean}
 */
function isNoResults () {
  const resultsContext = (ANSWERS.core.globalStorage.getState('vertical-results') || {}).resultsContext;
  return resultsContext === 'no-results';
}

/**
 * Hide the filters view, and display the results view.
 */
function scrollToTop () {
  const resultsColumnEl = document.getElementById('js-resultsColumn');
  window.scroll({
    top: 0
  });
  resultsColumnEl.scrollTop = 0;
}

/**
 * Scroll the screen down a certain distance.
 * On mobile, we need to do window.scroll, since the whole page
 * is scrollable. Otherwise, only the .js-resultsColumn element
 * is scrollable.
 * @param {number} distance 
 */
function scrollDown (distance) {
  const resultsColumnEl = document.getElementById('js-resultsColumn');
  resultsColumnEl.scrollTop = resultsColumnEl.scrollTop + distance;
  window.scroll({
    top: window.scrollY + distance
  });
}



/**
 * Detects whether the current navigator.userAgent is a mobile device.
 * forked from https://github.com/juliangruber/is-mobile/blob/master/index.js
 * @returns {boolean}
 */ 
function isMobile (opts) {
  var mobileRE = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series[46]0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i
  var tabletRE = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series[46]0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino|android|ipad|playbook|silk/i

  if (!opts) opts = {}
  var ua = opts.ua
  if (!ua && typeof navigator !== 'undefined') ua = navigator.userAgent
  if (ua && ua.headers && typeof ua.headers['user-agent'] === 'string') {
    ua = ua.headers['user-agent']
  }
  if (typeof ua !== 'string') return false

  var result = opts.tablet ? tabletRE.test(ua) : mobileRE.test(ua)

  if (
    !result &&
    opts.tablet &&
    opts.featureDetect &&
    navigator &&
    navigator.maxTouchPoints > 1 &&
    ua.indexOf('Macintosh') !== -1 &&
    ua.indexOf('Safari') !== -1
  ) {
    result = true
  }

  return result
}

/**
 * Gets the lifecycle methods for a component, using a specific hitchhiker
 * component manager.
 * The 'this' context of the individual methods is the SDK component instance.
 */
function getLifecycleMethods(hhComponentManager) {
  return {
    onCreate: function() {
      hhComponentManager.onCreate && hhComponentManager.onCreate(this);
    },
    onMount: function() {
      hhComponentManager.onMount && hhComponentManager.onMount(this);
    }
  }
} 