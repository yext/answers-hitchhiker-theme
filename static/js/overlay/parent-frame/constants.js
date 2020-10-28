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

exports.FilePaths = {
  /**
   * Corresponds to the button static asset path defined in the webpack-config
   */
  BUTTON_ASSET: 'overlay-button.html'
};

