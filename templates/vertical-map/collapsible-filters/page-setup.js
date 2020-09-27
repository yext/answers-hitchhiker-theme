{{> collapsible-filters/js-helpers}}
{{> collapsible-filters/interactions}}
const pageInteractions = new CollapsibleFiltersInteractions({
  filterEls: document.querySelectorAll('.js-answersFiltersWrapper'),
  resultEls: document.querySelectorAll('.js-answersResults')
});

{{> collapsible-filters/facets-manager}}
{{> collapsible-filters/view-results-button/component}}
{{> collapsible-filters/filter-panel-toggle/component}}

JsHelpers.registerHideFiltersOnSearchbarSearch();
JsHelpers.clearFacetsPersistentStorage();

const IS_MOBILE = JsHelpers.isMobile();

const ComponentManagers = {};
ComponentManagers.Facets = new FacetsManager();
{{> templates/vertical-map/collapsible-filters/script }}