{{> theme-components/collapsible-filters/js-helpers }}
{{> theme-components/collapsible-filters/interactions }}
const pageInteractions = new CollapsibleFiltersInteractions({
  filterEls: document.querySelectorAll('.js-answersFiltersWrapper'),
  resultEls: document.querySelectorAll('.js-answersResults,.js-answersFooter')
});

{{> theme-components/collapsible-filters/view-results-button/component }}
{{> theme-components/collapsible-filters/filter-link/component }}

pageInteractions.registerHideFiltersOnSearchbarSearch();
JsHelpers.clearFacetsPersistentStorage();

const IS_MOBILE = JsHelpers.isMobile();

const ComponentManagers = {};
{{> templates/vertical-standard/collapsible-filters/facets-manager }}
ComponentManagers.Facets = new FacetsManager();
{{> templates/vertical-standard/collapsible-filters/script }}
