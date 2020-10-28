/**
 * Internal-only, action types that the iframes and parent frame use as action
 * identifiers. The string values of these are not important, they just need to
 * be consistent across frames.
 */
exports.ActionTypes = {
  INIT: 'init',
  CONFIG: 'config',
  IFRAME_CONNECTED: 'iframeConnected',
  BUTTON_CONNECTED: 'buttonConnected',
  IFRAME_READY: 'iframeReady',
  COLLAPSE: 'collapse',
  EXPAND: 'expand',
  QUERY_SUBMITTED: 'querySubmitted',
  CLEAR_BUTTON_HIT: 'clearButtonHit',
  TOGGLE_OVERLAY: 'toggle',
};

