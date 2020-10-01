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

const ComponentDecorators = {};
{{> theme-components/collapsible-filters/facets-decorator }}
ComponentDecorators.Facets = new FacetsDecorator();
{{> templates/vertical-standard/collapsible-filters/script }}
