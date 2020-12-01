/**
 * Shape updates the theme page styling to match the Overlay's outer shape
 */
export default class Shape {

/**
 * Updates the theme page's styling for the Overlay's smaller state
 */
shrinkOverlay() {
  const bodyEl = document.querySelector('body');

  if (bodyEl) {
    bodyEl.classList.add('shorter');
    bodyEl.classList.remove('taller');
  }
}

/**
 * Updates the theme page's styling for the Overlay's larger state
 */
growOverlay() {
  const bodyEl = document.querySelector('body');

  if (bodyEl) {
    bodyEl.classList.add('taller');
    bodyEl.classList.remove('shorter');
  }
}

/**
 * Updates the theme page's styling for the Overlay's collapsed state
 */
collapseOverlay() {
  const bodyEl = document.querySelector('body');

  if (bodyEl) {
    bodyEl.classList.add('collapsed');
    bodyEl.classList.remove('expanded');
  }
}

/**
 * Updates the theme page's styling for the Overlay's expanded state
 *
 * @param {boolean} isMobile
 */
expandOverlay(isMobile) {
  const bodyEl = document.querySelector('body');

  if (bodyEl) {
    bodyEl.classList.remove('collapsed');
    bodyEl.classList.add('expanded');

    if (bodyEl.classList.contains('shorter') && !isMobile) {
      const inputEl = document.querySelector('.js-yext-query');
      inputEl && inputEl.focus();
    }
  }
}
}
