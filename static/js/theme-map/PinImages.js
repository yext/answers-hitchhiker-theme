/**
 * PinImages is meant to offer an accessible way to change the pin images for result pin
 * on the interactive map page. Given some config, an SVG should be customizable to
 * have branding consistent styling in this file.
 */
class PinImages {
  /**
   * @param {Object} defaultPinConfig The configuration for the default pin
   * @param {Object} hoveredPinConfig The configuration for the hovered pin
   * @param {Object} selectedPinConfig The configuration for the selected pin
   */
  constructor(defaultPinConfig = {}, hoveredPinConfig = {}, selectedPinConfig = {}) {
    this.defaultPinConfig = defaultPinConfig;
    this.hoveredPinConfig = hoveredPinConfig;
    this.selectedPinConfig = selectedPinConfig;
  }

  /**
   * Generate standard theme pin given some parameters
   * @param {string} pin.backgroundColor Background color for the pin
   * @param {string} pin.strokeColor Stroke (border) color for the pin
   * @param {string} pin.labelColor Label (text) color for the pin
   * @param {string} pin.width The width of the pin
   * @param {string} pin.height The height of the pin
   * @param {string} pin.pinCount The index of the pin for the pin text
   * @return string The SVG of the pin
   */
  generatePin ({
    backgroundColor = '#00759e',
    strokeColor = 'black',
    labelColor = 'white',
    width = '20px',
    height= '27px',
    index = '',
    profile = ''
  } = {}) {
    return `
    <svg width="${width}" height="${height}" viewBox="0 0 20 27" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <title>Path</title>
        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <path d="M10.0501608,26.9990713 C16.0167203,19.9483571 19,14.5376667 19,10.767 C19,4.82 14.9704545,1 10,1 C5.02954545,1 1,4.82 1,10.767 C1,14.4756667 4.01672027,19.8863571 10.0501608,26.9990713 Z" id="Path" stroke="${strokeColor}" fill="${backgroundColor}" fill-rule="nonzero"></path>
          <text fill="white"
              font-family="Arial-BoldMT,Arial"
              font-size="12"
              font-weight="bold">
          <tspan x="50%" y="15" text-anchor="middle">${index}</tspan>
        </text>
        </g>
    </svg>
    `;
  };

  /**
   * Get the default pin image
   * @param {Number} pinCount The pin index number for the pin label
   * @param {Object} profile The profile data for the entity associated with the pin
   */
  getDefaultPin (index, profile) {
    return this.generatePin({
      backgroundColor: this.defaultPinConfig.backgroundColor,
      strokeColor: this.defaultPinConfig.strokeColor,
      labelColor: this.defaultPinConfig.labelColor,
      width: '24',
      height: '28',
      index: '',
      profile: profile
    });
  }

  /**
   * Get the hovered pin image
   * @param {Number} pinCount The pin index number for the pin label
   * @param {Object} profile The profile data for the entity associated with the pin
   */
  getHoveredPin (index, profile) {
    return this.generatePin({
      backgroundColor: this.hoveredPinConfig.backgroundColor,
      strokeColor: this.hoveredPinConfig.strokeColor,
      labelColor: this.hoveredPinConfig.labelColor,
      width: '24',
      height: '34',
      index: '',
      profile: profile
    });
  }

  /**
   * Get the selected pin image
   * @param {Number} pinCount The pin index number for the pin label
   * @param {Object} profile The profile data for the entity associated with the pin
   */
  getSelectedPin (index, profile) {
    return this.generatePin({
      backgroundColor: this.selectedPinConfig.backgroundColor,
      strokeColor: this.selectedPinConfig.strokeColor,
      labelColor: this.selectedPinConfig.labelColor,
      width: '24',
      height: '34',
      index: '',
      profile: profile
    });
  }
}

export { PinImages };
