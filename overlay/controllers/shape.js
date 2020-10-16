window.shrinkOverlay = function () {
  const bodyEl = document.querySelector('body');

  if (bodyEl) {
    bodyEl.classList.add('shorter');
    bodyEl.classList.remove('taller');
  }
}

window.growOverlay = function () {
  const bodyEl = document.querySelector('body');

  if (bodyEl) {
    bodyEl.classList.add('taller');
    bodyEl.classList.remove('shorter');
  }
}

window.collapseOverlay = function () {
  const buttonEl = document.querySelector('.js-OverlayButton');
  if (buttonEl && buttonEl.classList.contains('js-OverlayButton-hideWhenCollapsed')) {
    buttonEl.style['display'] = 'none';
  } else {
    buttonEl && (buttonEl.style['width'] = `${window.getOverlayButtonWidth() / 16}rem`);
  }

  const bodyEl = document.querySelector('body');

  if (bodyEl) {
    bodyEl.classList.add('collapsed');
    bodyEl.classList.remove('expanded');
  }
}

window.expandOverlay = function () {
  const buttonEl = document.querySelector('.js-OverlayButton');
  buttonEl.style['display'] = 'block';
  buttonEl && (buttonEl.style['width'] = '4rem');

  const bodyEl = document.querySelector('body');

  if (bodyEl) {
    bodyEl.classList.remove('collapsed');
    bodyEl.classList.add('expanded');

    const inputEl = document.querySelector('.js-yext-query');
    inputEl && inputEl.focus();
  }
}

window.getOverlayButtonWidth = function () {
  const buttonEl = document.querySelector('.js-OverlayButton');
  return buttonEl && buttonEl.getBoundingClientRect().width;
}

window.getOverlayButtonHeight = function () {
  const buttonEl = document.querySelector('.js-OverlayButton');
  return buttonEl && buttonEl.getBoundingClientRect().height;
}