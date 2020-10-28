// Import global polyfills
import 'core-js/stable';

// Import all SCSS
import Scss from '../../../scss/answers/overlay/button/_default.scss';

// Import all JS assets
import OverlayButtonJS from './button.js';
export { OverlayButtonJS };
window.OverlayButtonJS = OverlayButtonJS;

import ActionTypes from '../shared/constants.js';
export { ActionTypes };
window.ActionTypes = ActionTypes;