/**
 * This class is responsible for injecting any the prompts from the Overlay config into
 * the DOM.
 */
export default class PromptInjector {
  constructor(prompts = []) {
    /**
     * @type {Array<Object>}
     */
    this.prompts = prompts;

    /**
     * @type {Element}
     */
    this.promptsWrapperEl = document.querySelector('.js-OverlayPromptButtons');
  }

  /**
   * Inserts prompts and adds event listeners to handle prompt button interactions
   */
  inject() {
    if (!this.promptsWrapperEl || this.prompts.length <= 0) {
      return;
    }

    this._injectPrompts();
    this._attachEventListeners();
  }

  /**
   * Injects prompts as buttons or links into the DOM, based on their configuration.
   */
  _injectPrompts() {
    for (const prompt of this.prompts) {
      if (!prompt.text) {
        continue;
      }

      const promptEl = prompt.url
        ? this._createLinkEl(prompt.url, prompt.target)
        : this._createButtonEl();

      this.promptsWrapperEl.appendChild(promptEl);
      this._appendPromptText(promptEl, prompt.text);
      this._appendChevronRight(promptEl);
    }
  }

  /**
   * Attaches the Overlay event listeners to the prompt elements
   */
  _attachEventListeners() {
    const promptLinkEls = document.querySelectorAll('.js-OverlayPrompt-link');
    for (const promptLinkEl of promptLinkEls) {
      promptLinkEl.addEventListener('click', () => {
        window.Overlay.grow();
      });
    }

    const promptButtonEls = document.querySelectorAll('.js-OverlayPrompt-button');
    for (const promptButtonEl of promptButtonEls) {
      promptButtonEl.addEventListener('click', function() {
        ANSWERS.search(promptButtonEl.innerText);
        window.Overlay.grow();
      });
    }
  }

  /**
   * Creates a prompt button element
   *
   * @returns {Element}
   */
  _createButtonEl() {
    const promptEl = document.createElement('button');
    promptEl.classList.add('OverlayPrompt-button');
    promptEl.classList.add('js-OverlayPrompt-button');
    return promptEl;
  }

  /**
   * Creates a prompt link element
   *
   * @param {string} url The value for the href of the link
   * @param {string} target The link target
   * @returns {Element}
   */
  _createLinkEl(url, target) {
    const promptEl = document.createElement('a');
    promptEl.classList.add('OverlayPrompt-button');
    promptEl.classList.add('js-OverlayPrompt-link');
    promptEl.href = url;
    if (target) {
      promptEl.target = target;
    }
    return promptEl;
  }

  /**
   * Appends an element with prompt text into the given element
   *
   * @param {Element} el
   * @param {string} promptText
   */
  _appendPromptText(el, promptText) {
    const promptEl = document.createElement('div');
    promptEl.classList.add('OverlayPrompt-label');
    promptEl.innerText = promptText;
    el.appendChild(promptEl);
  }

  /**
   * Appends an element with a chevron-right icon to the given element
   *
   * @param {Element} el
   */
  _appendChevronRight(el) {
    const iconEl = document.createElement('div');
    iconEl.classList.add('OverlayPrompt-buttonIcon');
    iconEl.innerHTML = `<?xml version="1.0" encoding="UTF-8"?>
      <svg viewBox="0.5 0 6 9"
        version="1.1" xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink">
        <g fill-rule="evenodd" transform="translate(-1 -8)">
          <path d="m2.6417004 8-1.1417004 1.0575 3.70850202 3.4425-3.70850202 3.4425 1.1417004 1.0575 4.8582996-4.5z"/>
        </g>
      </svg>`;

    el.appendChild(iconEl);
  }
}