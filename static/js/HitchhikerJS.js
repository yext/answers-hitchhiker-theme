// Import all JS assets
import Formatters from './formatters';
window.Formatter = Formatters;

export { Formatters };
export { getDefaultMapApiKey } from './default-map-api-key';
export { isStaging } from './is-staging';
export { isMobile }  from 'is-mobile';
export { getInjectedProp } from './get-injected-prop';
export { isHighlighted } from './is-highlighted';


//polyfill for ie11 styling
import objectFitImages from 'object-fit-images';
export { objectFitImages }

// Used to transfigure the page for the Overlay
import Overlay from './overlay/answers-frame/overlay';
window.Overlay = new Overlay();

// Import code used in Collapsible Filters, and give it the alias of window.CollapsibleFilters.
import CollapsibleFilters from './collapsible-filters';
export { CollapsibleFilters };
global.CollapsibleFilters = CollapsibleFilters;

// Import custom modules which can be accessed from HitchhikerJS.CustomModules
import * as CustomModules from './custom-modules';
export { CustomModules };

import StorageKeys from './constants/storage-keys';
export { StorageKeys };

import transformFacets from './transform-facets';
export { transformFacets }

import ManualInitializer from './manual-initializer';
export { ManualInitializer };

import RuntimeConfigReceiver from './runtime-config-receiver';
export { RuntimeConfigReceiver };

import RuntimeConfig from './runtime-config';
const runtimeConfig = new RuntimeConfig();

import AnswersExperience from './answers-experience';
window.AnswersExperience = new AnswersExperience(runtimeConfig);

export * from './video-apis';

import DOM from './dom';
export { DOM };