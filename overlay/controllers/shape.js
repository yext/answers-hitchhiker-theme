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
  } else if (window.buttonWidth) {
    buttonEl && (buttonEl.style['width'] = `${window.buttonWidth / 16}rem`);
  }

  const bodyEl = document.querySelector('body');

  if (bodyEl) {
    bodyEl.classList.add('collapsed');
    bodyEl.classList.remove('expanded');
  }
}

window.expandOverlay = function () {
  const buttonEl = document.querySelector('.js-OverlayButton');
  if (buttonEl) {
    buttonEl.style['display'] = 'block';
    buttonEl.style['width'] = '4rem';
  }

  const bodyEl = document.querySelector('body');

  if (bodyEl) {
    bodyEl.classList.remove('collapsed');
    bodyEl.classList.add('expanded');

    const inputEl = document.querySelector('.js-yext-query');
    inputEl && inputEl.focus();
  }
}
