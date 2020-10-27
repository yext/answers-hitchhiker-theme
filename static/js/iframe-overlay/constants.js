exports.Selectors = {
  OVERLAY_CONTAINER_ID: 'YxtAnswersOverlay',
  IFRAME_CONTAINER_ID: 'YxtAnswersOverlay-container',
  IFRAME_ID: 'YxtAnswersOverlay-iframe',
  BUTTON_FRAME_ID: 'YxtAnswersOverlay-buttonFrame',
};

exports.InteractionTypes = {
  INIT: 'init',
  IFRAME_CONNECTED: 'iframeConnected',
  BUTTON_CONNECTED: 'buttonConnected',
  IFRAME_READY: 'iframeReady',
  COLLAPSE: 'collapse',
  EXPAND: 'expand',
  QUERY_SUBMITTED: 'querySubmitted',
  CLEAR_BUTTON_HIT: 'clearButtonHit',
  TOGGLE_OVERLAY: 'toggle',
};

exports.ActionTypes = {
  COLLAPSE: 'collapse',
  EXPAND: 'expand'
};

exports.AnimationStyling = {
  TRANSITION_TIMING: '.4s',
  BOX_SHADOW_NORMAL: '0 3px 10px 0 rgba(0,0,0,0.4)',
  BOX_SHADOW_NONE: '0 3px 10px 0 rgba(0,0,0,0)',
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
};

exports.FilePaths = {
  BUTTON_ASSET: 'overlay-button.html'
};
