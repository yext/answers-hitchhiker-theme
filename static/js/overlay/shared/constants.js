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
  BUTTON_READY: 'buttonReady'
};

/**
 * Animation constants determined by UX.
 */
exports.AnimationStyling = {
  TRANSITION_TIMING: '.4s',
  BOX_SHADOW_NORMAL: '0 3px 10px 0 rgba(0,0,0,0.4)',
  BOX_SHADOW_NONE: '0 3px 10px 0 rgba(0,0,0,0)',
  BOX_SHADOW_ACTIVE: '0 3px 10px 0 rgba(0,0,0,0.7)',
  WIDTH_DESKTOP: '445px',
  WIDTH_MOBILE: '100vw',
  MIN_HEIGHT: 450,
  CONTAINER_HEIGHT_TALLER: '100vh',
  MAX_HEIGHT_DESKTOP: 'calc(100% - 32px)',
  MAX_WIDTH_DESKTOP: 'calc(100% - 32px)',
  MAX_HEIGHT_MOBILE: '100%',
  MAX_WIDTH_MOBILE: '100%',
  BASE_SPACING: '16px',
  ZINDEX_HIDDEN: '−2147483648',
  ZINDEX_FRONTMOST: '2147483647',
  ZINDEX_ALMOST_FRONTMOST: '2147483646',
  DEFAULT_BUTTON_SIZE: 65,
  PROMPTS_SPACING: 58,
  MAX_BUTTON_WIDTH: 420,
  MAX_LABEL_WIDTH: 360,
  BUTTON_SPACING: 8
};
