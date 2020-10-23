exports.Selectors = {
  IFRAME_CONTAINER_ID: 'YextAnswersOverlay-container',
  IFRAME_ID: 'YextAnswersOverlay-iframe',
};

exports.InteractionTypes = {
  INIT: 'init',
  BUTTON_READY: 'buttonReady',
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
  FADE_TIMING: '.4s',
  SIZE_TIMING: '.15s',
  BOX_SHADOW_NORMAL: '0 3px 10px 0 rgba(0,0,0,0.4)',
  BOX_SHADOW_NONE: '0 3px 10px 0 rgba(0,0,0,0)',
  WIDTH_DESKTOP: '445px',
  WIDTH_MOBILE: '100vw',
  MIN_HEIGHT: 525,
  MAX_HEIGHT_DESKTOP: 'calc(100% - 32px)',
  MAX_WIDTH_DESKTOP: 'calc(100% - 32px)',
  MAX_HEIGHT_MOBILE: '100%',
  MAX_WIDTH_MOBILE: '100%',
  BASE_SPACING: '16px',
  HEIGHT_TALLER: 'calc(100% - 32px)'
};
