class ClusterPinImages {
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
    width = '24px',
    height= '24px',
    pinCount = ''
  } = {}) {
    return `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <g fill="none" fill-rule="evenodd">
          <circle fill="${backgroundColor}" fill-rule="nonzero" stroke="${strokeColor}" cx="12" cy="12" r="11"/>
          <text fill="${labelColor}" font-family="Arial-BoldMT,Arial" font-size="12" font-weight="bold">
            <tspan x="50%" y="16" text-anchor="middle">${pinCount}</tspan>
          </text>
        </g>
      </svg>`)}`;
  };

  /**
   * Get the default pin image
   */
  getDefaultPin (pinCount, profile) {
    return this.generatePin({
      backgroundColor: this.defaultPinConfig.backgroundColor,
      strokeColor: this.defaultPinConfig.strokeColor,
      labelColor: this.defaultPinConfig.labelColor,
      width: '24px',
      height: '24px',
      pinCount: pinCount,
    });
  }

  /**
   * Get the hovered pin image
   */
  getHoveredPin (pinCount, profile) {
    return this.generatePin({
      backgroundColor: this.hoveredPinConfig.backgroundColor,
      strokeColor: this.hoveredPinConfig.strokeColor,
      labelColor: this.hoveredPinConfig.labelColor,
      width: '24px',
      height: '24px',
      pinCount: pinCount,
    });
  }

  /**
   * Get the selected pin image
   */
  getSelectedPin (pinCount, profile) {
    return this.generatePin({
      backgroundColor: this.selectedPinConfig.backgroundColor,
      strokeColor: this.selectedPinConfig.strokeColor,
      labelColor: this.selectedPinConfig.labelColor,
      width: '24px',
      height: '24px',
      pinCount: pinCount,
    });
  }
}

export { ClusterPinImages };
