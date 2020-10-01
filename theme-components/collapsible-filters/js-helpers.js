/**
 * Some common javascript helpers used by collapsible filters.
 */
class JsHelpers {
  /**
   * Detects whether the current navigator.userAgent is a mobile device.
   * forked from https://github.com/juliangruber/is-mobile/blob/master/index.js
   * @returns {boolean}
   */
  static isMobile(opts) {
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
   * component decorator.
   * The 'this' context of each lifecycle method is the SDK component instance.
   */
  static getLifecycleMethods(hhComponentDecorator) {
    return {
      onCreate: function () {
        hhComponentDecorator.onCreate && hhComponentDecorator.onCreate(this);
      },
      onMount: function () {
        hhComponentDecorator.onMount && hhComponentDecorator.onMount(this);
      }
    }
  }

  static clearSearch() {
    ANSWERS.core.setQuery('');
    ANSWERS.core.persistentStorage.set('query', '');
  }

  static removeAllFilterNodes() {
    const filterNodes = ANSWERS.core.filterRegistry
      .getAllFilterNodes()
      .filter(fn => fn.getFilter().getFilterKey());
    filterNodes.forEach(node => {
      node.remove();
    });
  }

  static verticalSearch(options) {
    const verticalKey = ANSWERS.core.globalStorage.getState('search-config').verticalKey;
    ANSWERS.core.verticalSearch(verticalKey, options);
  }

  /**
   * Clears the persistent storage keys corresponding to Facets.
   * Persistent storage is buggy with Facets, so dont use it on page load for now.
   * @param {string} prefix 
   */
  static clearFacetsPersistentStorage(prefix = 'Facets') {
    for (const urlParamKey in ANSWERS.core.persistentStorage.getAll()) {
      if (urlParamKey.startsWith(prefix)) {
        ANSWERS.core.persistentStorage.delete(urlParamKey, true)
      }
    }
  }

  /**
   * Scroll the screen to the top.
   */
  static scrollToTop () {
    window.scroll({
      top: 0
    });
  }

  /**
   * Scroll the screen down a certain distance.
   * @param {number} distance 
   */
  static scrollDown (distance) {
    window.scroll({
      top: window.scrollY + distance
    });
  }
}