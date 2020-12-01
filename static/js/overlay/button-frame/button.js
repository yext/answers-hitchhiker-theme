import { ActionTypes, AnimationStyling } from '../shared/constants';
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
          labelText: message.details.labelText,
          backgroundColor: message.details.backgroundColor,
          foregroundColor: message.details.foregroundColor
        };

        OverlayButtonJS.insertText(
          document.querySelector('.js-OverlayButton-displayWhenCollapsed'),
          config.labelText);
        OverlayButtonJS.applyStyling(
          buttonEl, config.backgroundColor, config.foregroundColor);
        OverlayButtonJS.attachEventListeners(buttonEl);

        const buttonSize = buttonEl.getBoundingClientRect();
        OverlayButtonJS.notifyParentFrame(new IFrameMessage(ActionTypes.BUTTON_READY, {
          height: buttonSize.height,
          width: config.labelText ? buttonSize.width : AnimationStyling.DEFAULT_BUTTON_SIZE
        }));
        break;
      case ActionTypes.COLLAPSE:
        OverlayButtonJS.collapseButton(buttonEl);
        break;
      case ActionTypes.EXPAND:
        OverlayButtonJS.expandButton(buttonEl);
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
  }

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

      OverlayButtonJS.notifyParentFrame(new IFrameMessage(messageType));
    });
  }

  /**
   * Inserts label text into the given container element
   *
   * @param {Element} el
   * @param {string} labelText
   */
  static insertText(el, labelText) {
    if (!el || !labelText) {
      return;
    }
    const labelEl = this._injectLabelTextEl(el, labelText);
    this._adjustLabelWidth(labelEl);
  }

  /**
   * Injects label text into the given element
   *
   * @param {Element} containerEl
   * @param {string} labelText
   * @returns {Element} the label text element
   */
  static _injectLabelTextEl(containerEl, labelText) {
    const labelEl = document.createElement('span');
    labelEl.classList.add('OverlayButton-text');
    labelEl.innerText = labelText;
    containerEl.appendChild(labelEl);

    return labelEl;
  }

  /**
   * Sets the width of the label element, adding ellipsis if the calculated width is
   * larger than the maximum
   *
   * @param {Element} labelEl
   */
  static _adjustLabelWidth(labelEl) {
    const width = labelEl.getBoundingClientRect().width + AnimationStyling.BUTTON_SPACING;
    labelEl.style['width'] = `${Math.min(width, AnimationStyling.MAX_LABEL_WIDTH)}px`;
    if (width > AnimationStyling.MAX_LABEL_WIDTH) {
      labelEl.style['overflow'] = 'hidden';
      labelEl.style['text-overflow'] = 'ellipsis';
    }
  }

  /**
   * Sends a message to the parent frame
   *
   * @param {IFrameMessage} message
   */
  static notifyParentFrame(message) {
    window.parentIFrame.sendMessage(message.toObject());
  }
}
