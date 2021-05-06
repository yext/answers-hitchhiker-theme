// For signaling collapsible filters specific behavior in components.
const IS_COLLAPSIBLE_FILTERS = true;

// Register the CollapsibleFiltersInteractions class, and instantiate an instance
// of it, to be called within component config.
const collapsibleFiltersInteractions = new CollapsibleFilters.Interactions({
  filterEls: document.querySelectorAll('.js-answersFiltersWrapper'),
  resultEls: document.querySelectorAll('.js-answersResults,.js-answersFooter,.js-yxtFooter'),
  templateName: 'VerticalGrid'
});

// When a search is made with the searchbar, collapse the filters.
collapsibleFiltersInteractions.registerCollapseFiltersOnSearchbarSearch();

// Make the view results button sticky
collapsibleFiltersInteractions.stickifyViewResultsButton(true);

// Setup the Footer so that it can properly interact with CFilters
collapsibleFiltersInteractions.setupFooter();

// Register an instance of CollapsibleFilters.FacetsDecorator,
// to decorate the Facets component with
const facetsDecorator = new CollapsibleFilters.FacetsDecorator();

// Register the theme components used in CollapsibleFilters, and
// add them to the page with ANSWERS.addComponent()
{{> theme-components/collapsible-filters/view-results-button/component}}
{{> templates/vertical-grid/collapsible-filters/script/viewresultsbutton }}
{{> theme-components/collapsible-filters/filter-link/component}}
{{> templates/vertical-grid/collapsible-filters/script/filterlink }}