// Import global polyfills
import 'core-js/stable';

// Import all SCSS
import Scss from './scss/answers/_default.scss';

// Import all JS assets
import Formatters from './js/formatters';
window.Formatter = Formatters;

export { Formatters };
export { getDefaultMapApiKey } from './js/default-map-api-key';
export { isStaging } from './js/is-staging';
export { isMobile }  from 'is-mobile';

// Import code used in Collapsible Filters, and give it the alias of window.CollapsibleFilters.
import CollapsibleFilters from './js/collapsible-filters';
export { CollapsibleFilters };
global.CollapsibleFilters = CollapsibleFilters;