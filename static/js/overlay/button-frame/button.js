import { ActionTypes } from '../shared/constants';
import IFrameMessage from '../shared/iframemessage';

export default class OverlayButtonJS {
  /**
   * Handles a message from the parent frame
   *
   * @param {Object} message
   */
  static onMessage (message) {
    const buttonEl = document.querySelector('.js-OverlayButton');
    switch (message.type) {
      case ActionTypes.CONFIG:
        const config = {
          labelText: '', // TODO (agrow) in a later PR, inject labelText
          backgroundColor: message.backgroundColor,
          foregroundColor: message.foregroundColor
        };

        OverlayButtonJS._applyStyling(
          buttonEl, config.backgroundColor, config.foregroundColor);
        OverlayButtonJS._attachEventListeners(buttonEl);
        break;
      case ActionTypes.COLLAPSE:
        OverlayButtonJS._collapseButton(buttonEl);
        break;
      case ActionTypes.EXPAND:
        OverlayButtonJS._expandButton(buttonEl);
        break;
      default:
        break;
    }
  }

  /**
   * Updates the button to its collapsed state
   *
   * @param {Element} buttonEl
   */
  static _collapseButton(buttonEl) {
    buttonEl.classList.add('collapsed');
  }

  /**
   * Updates the button to its expanded state
   *
   * @param {Element} buttonEl
   */
  static _expandButton(buttonEl) {
    buttonEl.classList.remove('collapsed');
  }

  /**
   * Injects styling for the background and foreground colors
   *
   * @param {Element} buttonEl
   * @param {string} backgroundColor
   * @param {string} foregroundColor
   */
  static _applyStyling(buttonEl, backgroundColor, foregroundColor) {
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
  static _attachEventListeners(buttonEl) {
    buttonEl.addEventListener('click', () => {
      const isCollapsed = buttonEl.classList.contains('collapsed');
      if (isCollapsed) {
        OverlayButtonJS._expandButton(buttonEl);
      } else {
        OverlayButtonJS._collapseButton(buttonEl);
      }

      const messageType = isCollapsed
        ? ActionTypes.EXPAND
        : ActionTypes.COLLAPSE;

      this._notifyParentFrame(new IFrameMessage(messageType));
    });
  }

  /**
   * Sends a message to the parent frame
   *
   * @param {IFrameMessage} message
   */
  _notifyParentFrame(message) {
    window.parentIFrame.sendMessage({
      type: message.getType(),
      ...message.getDetails()
    });
  }
}
