/**
 * Some common javascript helpers used by collapsible filters.
 */
class JsHelpers {
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