import { ActionTypes } from '../shared/constants';

export default class OverlayButtonJS {
  /**
   * Updates the button to its collapsed state
   *
   * @param {Element} buttonEl
   */
  static collapseButton(buttonEl) {
    buttonEl.classList.add('collapsed');
  }

  /**
   * Updates the button to its expanded state
   *
   * @param {Element} buttonEl
   */
  static expandButton(buttonEl) {
    buttonEl.classList.remove('collapsed');
  }

  /**
   * Injects styling for the background and foreground colors
   *
   * @param {Element} buttonEl
   * @param {string} backgroundColor
   * @param {string} foregroundColor
   */
  static applyStyling(buttonEl, backgroundColor, foregroundColor) {
    // Add background color
    const bodyEl = document.querySelector('body');
    bodyEl && (bodyEl.style['background-color'] = backgroundColor);
    buttonEl && (buttonEl.style['background-color'] = backgroundColor);

    // Add foreground color
    buttonEl && (buttonEl.style['color'] = foregroundColor);
    const buttonIconEls = buttonEl.querySelectorAll('.js-OverlayButton-icon svg');
    for (const buttonIconEl of buttonIconEls) {
      buttonIconEl.style.fill = foregroundColor;
    }
  };

  /**
   * Attaches the Overlay event listeners to the button
   *
   * @param {Element} buttonEl
   */
  static attachEventListeners(buttonEl) {
    buttonEl.addEventListener('click', function () {
      const isCollapsed = buttonEl.classList.contains('collapsed');
      if (isCollapsed) {
        OverlayButtonJS.expandButton(buttonEl);
      } else {
        OverlayButtonJS.collapseButton(buttonEl);
      }

      const messageType = isCollapsed
        ? ActionTypes.EXPAND
        : ActionTypes.COLLAPSE;
      window.parentIFrame.sendMessage({
        type: messageType
      });
    });
  }
}
