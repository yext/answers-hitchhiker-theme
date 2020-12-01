import { AnimationStyling } from '../../shared/constants';
import HeaderPanelInfuser from '../dom/headerpanelinfuser';
import PromptInjector from '../dom/promptinjector';
import Shape from './shape';

/**
 * PageDecorator is responsible for adding any configurable Overlay styling or HTML
 * to the theme page
 */
export default class PageDecorator {
  constructor(shape) {
    /**
     * @type {Shape}
     */
    this._shape = shape;
  }

  /**
   * Decorates the theme page with the Overlay elements and styling specified
   *
   * @param {boolean} isCollapsed
   * @param {Object} panel
   * @param {Array<Object>} prompts
   */
  decorate({ isCollapsed, panel, prompts } = {}) {
    const bodyEl = document.querySelector('body');
    bodyEl.classList.add('Overlay');

    new HeaderPanelInfuser(panel).infuse();
    new PromptInjector(prompts).inject();
    const promptsEl = document.querySelector('.js-Answers-overlaySuggestions');
    promptsEl && promptsEl.classList.remove('hidden');

    if (isCollapsed) {
      this._shape.shrinkOverlay();
    } else {
      this._shape.growOverlay();
    }
  }

  /**
   * Returns the height of the page, in pixels
   *
   * @returns {number}
   */
  getTotalHeight() {
    const buttonHeight = AnimationStyling.DEFAULT_BUTTON_SIZE + AnimationStyling.BUTTON_SPACING;
    const answersContentEl = document.querySelector('.Answers');
    const answersElSize = answersContentEl
      ? answersContentEl.getBoundingClientRect().height
      : 0;
    const promptsEl = document.querySelector('.js-Answers-overlaySuggestions');
    const promptsElSize = promptsEl
      ? promptsEl.getBoundingClientRect().height + AnimationStyling.PROMPTS_SPACING
      : 0;
    const answersHeight = Math.max(answersElSize, promptsElSize);

    const headerEl = document.querySelector('.OverlayHeader');
    const headerHeight = headerEl ? headerEl.getBoundingClientRect().height : 0;

    return answersHeight + headerHeight + buttonHeight;
  }
}
