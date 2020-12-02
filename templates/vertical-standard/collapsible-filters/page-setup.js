// For signaling collapsible filters specific behavior in components.
const IS_COLLAPSIBLE_FILTERS = true;

// The SDK does not support Facets on load, however the Facets
// component interacts with persistent storage in a way that suggests
// that it does. This is a temporary fix until the SDK is patched.
CollapsibleFilters.Helpers.clearFacetsPersistentStorage();

// Register the CollapsibleFiltersInteractions class, and instantiate an instance
// of it, to be called within component config.
const collapsibleFiltersInteractions = new CollapsibleFilters.Interactions({
  filterEls: document.querySelectorAll('.js-answersFiltersWrapper'),
  resultEls: document.querySelectorAll('.js-answersResults,.js-answersFooter')
});

// When a search is made with the searchbar, collapse the filters.
collapsibleFiltersInteractions.registerCollapseFiltersOnSearchbarSearch();

// Make the view results button sticky
collapsibleFiltersInteractions.stickifyViewResultsButton(true);

// Register an instance of CollapsibleFilters.FacetsDecorator,
// to decorate the Facets component with
const facetsDecorator = new CollapsibleFilters.FacetsDecorator();

// Register the theme components used in CollapsibleFilters, and
// add them to the page with ANSWERS.addComponent()
{{> theme-components/collapsible-filters/view-results-button/component}}
{{> templates/vertical-standard/collapsible-filters/script/viewresultsbutton }}
{{> theme-components/collapsible-filters/filter-link/component}}
{{> templates/vertical-standard/collapsible-filters/script/filterlink }}