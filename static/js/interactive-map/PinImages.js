class PinImages {
  constructor(defaultPinConfig = {}, hoveredPinConfig = {}, selectedPinConfig = {}) {
    this.defaultPinConfig = defaultPinConfig;
    this.hoveredPinConfig = hoveredPinConfig;
    this.selectedPinConfig = selectedPinConfig;
  }

  /**
   * Generate standard theme pin given some parameters
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
    return `data:image/svg+xml;utf8,${encodeURIComponent(`
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
    </svg>`)}`;
  };

  /**
   * Get the default pin image
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
