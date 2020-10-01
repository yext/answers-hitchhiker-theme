// Register the JsHelpers class which contains static helpers
{{> theme-components/collapsible-filters/js-helpers}}

// We currently do not support Facets on load, despite the appearance
// of the Facets component. This is a temporary fix until the SDK is patched.
JsHelpers.clearFacetsPersistentStorage();

// Register the CollapsibleFiltersInteractions class, and instantiate an instance
// of it, to be called within component config.
{{> theme-components/collapsible-filters/interactions}}
const pageInteractions = new CollapsibleFiltersInteractions({
  filterEls: document.querySelectorAll('.js-answersFiltersWrapper'),
  resultEls: document.querySelectorAll('.js-answersResults,.js-answersFooter')
});
// When a search is made with the searchbar, collapse the filters.
pageInteractions.registerCollapseFiltersOnSearchbarSearch();

const ComponentDecorators = {};
{{> theme-components/collapsible-filters/facets-decorator }}
ComponentDecorators.Facets = new FacetsDecorator();

// Register the theme components used in CollapsibleFilters, and
// add them to the page with ANSWERS.addComponent()
{{> theme-components/collapsible-filters/view-results-button/component}}
{{> templates/vertical-map/collapsible-filters/script/viewresultsbutton }}
{{> theme-components/collapsible-filters/filter-link/component}}
{{> templates/vertical-map/collapsible-filters/script/filterlink }}