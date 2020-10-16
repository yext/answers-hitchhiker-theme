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
  WIDTH_MOBILE: 'calc(100% - 32px)',
  OVERLAY_MIN_HEIGHT: 525,
  HEIGHT_TALLER: 'calc(100% - 32px)'
};
