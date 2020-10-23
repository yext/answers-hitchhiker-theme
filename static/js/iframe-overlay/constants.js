exports.Selectors = {
  OVERLAY_CONTAINER_ID: 'YextAnswersOverlay',
  IFRAME_CONTAINER_ID: 'YextAnswersOverlay-container',
  IFRAME_ID: 'YextAnswersOverlay-iframe',
  BUTTON_FRAME_ID: 'YextAnswersOverlay-buttonFrame',
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
  WIDTH_MOBILE: 'calc(100% - 32px)',
  MIN_HEIGHT: 525,
  CONTAINER_HEIGHT_TALLER: '100vh',
  MAX_HEIGHT_DESKTOP: 'calc(100% - 32px)',
  MAX_WIDTH_DESKTOP: 'calc(100% - 32px)',
  BASE_SPACING: '16px',
  ZINDEX_HIDDEN: '−2147483648',
  ZINDEX_FRONTMOST: '2147483647',
  ZINDEX_ALMOST_FRONTMOST: '2147483646',
};

exports.FilePaths = {
  BUTTON_ASSET: 'overlay-button.html'
};
