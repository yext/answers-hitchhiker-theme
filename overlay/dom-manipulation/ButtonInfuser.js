/**
 * This class is responsible for adding properties and event listeners to the button as
 * specified in the Overlay config.
 */
class ButtonInfuser {
  constructor(config = {}) {
    /**
     * @type {string}
     */
    this.labelText = config.labelText;

    /**
     * @type {string}
     */
    this.alignment = config.alignment;

    /**
     * @type {string}
     */
    this.backgroundColor = config.backgroundColor;

    /**
     * @type {string}
     */
    this.foregroundColor = config.foregroundColor;

    /**
     * @type {boolean}
     */
    this.hideWhenCollapsed = config.hideWhenCollapsed;

    /**
     * @type {Element}
     */
    this.buttonEl = document.querySelector('.js-OverlayButton');
  }

  /**
   * Adds properties and event listeners to the Overlay button
   */
  infuse() {
    if (!this.hideWhenCollapsed) {
      this.buttonEl.style['display'] = 'block';
    } else {
      this.buttonEl.classList.add('js-OverlayButton-hideWhenCollapsed');
    }

    this.labelText && this._injectLabelText();
    this._applyConfigStyling();
    this._attachEventListeners();
  }

  /**
   * Injects label text into the existing button label element if label text is present
   * in the config.
   */
  _injectLabelText () {
    const labelEl = document.createElement('span');
    labelEl.classList.add('OverlayButton-text');
    labelEl.innerText = this.labelText;

    const displayWhenCollapsedButtonEl = document.querySelector('.js-OverlayButton-displayWhenCollapsed');
    displayWhenCollapsedButtonEl.appendChild(labelEl);
  };

  /**
   * Injects styling for the button colors from the config
   */
  _applyConfigStyling() {
    this.buttonEl.style[this.alignment] = '16px';
    this.buttonEl.style['border-radius'] = `${this.labelText ? '200px' :'50%'}`;
    this.buttonEl.style['background-color'] = this.backgroundColor;
    this.buttonEl.style['color'] = this.foregroundColor;

    const buttonIconEls = this.buttonEl.querySelectorAll('.js-OverlayButton-icon svg');
    for (const buttonIconEl of buttonIconEls) {
      buttonIconEl.style.fill = this.foregroundColor;
    }
  };

  /**
   * Attaches the Overlay event listeners to the button
   */
  _attachEventListeners() {
    // Simple trigger clicks
    this.buttonEl.addEventListener('click', () => {
      const bodyEl = document.querySelector('body');
      const isCollapsed = bodyEl && bodyEl.classList.contains('collapsed');
      if (isCollapsed) {
        window.expandOverlay();
        window.parentIFrame.sendMessage({
          type: 'expand'
        });
      } else {
        window.collapseOverlay();
        window.parentIFrame.sendMessage({
          type: 'collapse'
        });
      }
    });

    // Event mimicking trigger clicks
    window.addEventListener('keyup', (e) => {
      const Keys = {
        ESCAPE: 'Escape',
      };
      if (e.key === Keys.ESCAPE) {
        window.collapseOverlay();
        window.parentIFrame.sendMessage({
          type: 'collapse'
        });
      }
    });
  };
}