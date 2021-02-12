/**
 * Resets all filters in the filter registry.
 */
ANSWERS.resetAllFilters = function () {
  const filterNodes = this.coreAdapter.filterRegistry
    .getAllFilterNodes()
    .filter(fn => fn.getFilter().getFilterKey());
  filterNodes.forEach(node => {
    node.remove();
  });
};

/**
 * Set the data in storage with the given key to the provided
 * data, completely overwriting any existing data.
 *
 * @param {string} key The storage key to set
 * @param {*} data The data to set
 */
ANSWERS.setStorage = function (key, data) {
  this.coreAdapter.storage.set(key, data);
};

/**
 * Retrieve data from storage.
 *
 * @param {string} key
 */
ANSWERS.getFromStorage = function (key) {
  return this.coreAdapter.storage.get(key);
};

/**
 * Remove the data in storage with the given key
 *
 * @param {string} key The storage key to delete
 */
ANSWERS.deleteFromStorage = function (key) {
  this.coreAdapter.storage.delete(key);
};

/**
 * Adds a listener to the given module for a given event.
 *
 * @param {StorageListener} listener the listener to add
 */
ANSWERS.registerListener = function (listener) {
  this.coreAdapter.storage.registerListener(listener);
};

/**
 * Conduct a vertical search with the provided options.
 *
 * @param {Object} options
 * @param {string} options.verticalKey the vertical ID for the search
 * @param {string} options.query the query string of the search
 * @param {boolean} options.useFacets enables facets if true
 * @param {boolean} options.resetPagination resets the search offset if true
 * @param {string} options.queryId the queryId associated with the search
 * @param {boolean} options.appendQuery if true, adds the results of this query to the current results
 */
ANSWERS.verticalSearch = function (options) {
  const verticalKey = options.verticalKey;
  const verticalOptions = {
    ...options.useFacets && { useFacets: options.useFacets },
    ...options.resetPagination && { resetPagination: options.resetPagination }
  };
  const queryOptions = {
    ...options.query && { input: options.query },
    ...options.queryId && { id: options.queryId },
    ...options.appendQuery && { append: options.appendQuery }
  };
  this.coreAdapter.verticalSearch(verticalKey, verticalOptions, queryOptions);
};