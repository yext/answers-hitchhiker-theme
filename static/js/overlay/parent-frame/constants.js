/**
 * Identifiers for elements injected into the parent frame
 */
exports.Selectors = {
  OVERLAY_CONTAINER_ID: 'YxtAnswersOverlay',
  IFRAME_CONTAINER_ID: 'YxtAnswersOverlay-container',
  IFRAME_ID: 'YxtAnswersOverlay-iframe',
  BUTTON_FRAME_ID: 'YxtAnswersOverlay-buttonFrame',
};

/**
 * The string values of these ExternalActionTypes are keys that users can hook into;
 * they must not change without notice.
 */
exports.ExternalActionTypes = {
  COLLAPSE: 'collapse',
  EXPAND: 'expand',
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
};

exports.FilePaths = {
  /**
   * Corresponds to the button static asset path defined in the webpack-config
   */
  BUTTON_ASSET: 'overlay-button.html'
};

