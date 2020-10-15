/**
 * This class is responsible for injecting any the prompts from the Overlay config into
 * the DOM.
 */
class PromptInjector {
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
   * Injects the prompts into the DOM.
   */
  inject() {
    if (!this.promptsWrapperEl || this.prompts.length <= 0) {
      return;
    }

    this._injectPrompts();
    this._attachEventListeners();

    const parentEl = document.querySelector('.js-Answers-overlaySuggestions');
    parentEl.classList.remove('hidden');
  }

  /**
   * Injects prompts as buttons or links into the DOM, based on their configuration.
   */
  _injectPrompts() {
    for (const prompt of this.prompts) {
      if (!prompt.text) {
        continue;
      }

      const promptEl = !prompt.url
        ? this._createButtonEl()
        : this._createLinkEl(prompt.url, prompt.target);

      this.promptsWrapperEl.appendChild(promptEl);
      this._appendPromptText(promptEl, prompt.text);
      this._appendChevronRight(promptEl);
    }
  }

  /**
   * Attaches the Overlay event listeners to the prompt elements
   */
  _attachEventListeners() {
    const promptLinkEls = document.querySelectorAll('.js-promptLink') || [];
    for (const promptLinkEl of promptLinkEls) {
      promptLinkEl.addEventListener('click', () => {
        window.parentIFrame.sendMessage({
          type: 'querySubmitted'
        });
      })
    }

    const promptButtonEls = document.querySelectorAll('.js-promptButton') || [];
    for (const promptButtonEl of promptButtonEls) {
      promptButtonEl.addEventListener('click', function() {
        ANSWERS.search(promptButtonEl.innerText);

        window.parentIFrame.sendMessage({
          type: 'querySubmitted'
        });

        window.growOverlay();
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
    promptEl.classList.add('js-promptButton');
    return promptEl;
  }

  /**
   * Creates a prompt link element
   *
   * @returns {Element}
   */
  _createLinkEl(url, target) {
    const promptEl = document.createElement('a');
    promptEl.classList.add('OverlayPrompt-button');
    promptEl.classList.add('js-promptLink');
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
    iconEl.innerHTML = `{{> overlay/icons/chevron-right }}`;

    el.appendChild(iconEl);
  }
}