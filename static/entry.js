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
export { getInjectedProp } from './js/get-injected-prop';
export { isHighlighted } from './js/is-highlighted';

// Used to transfigure the page for the Overlay
import Overlay from './js/overlay/answers-frame/overlay';
window.Overlay = new Overlay();

// Import code used in Collapsible Filters, and give it the alias of window.CollapsibleFilters.
import CollapsibleFilters from './js/collapsible-filters';
export { CollapsibleFilters };
global.CollapsibleFilters = CollapsibleFilters;

// Import custom modules which can be accessed from HitchhikerJS.CustomModules
import * as CustomModules from './js/custom-modules';
export { CustomModules };

import StorageKeys from './js/constants/storage-keys';
export { StorageKeys };

import transformFacets from './js/transform-facets';
export { transformFacets }