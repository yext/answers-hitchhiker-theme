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
  const bodyEl = document.querySelector('body');

  if (bodyEl) {
    bodyEl.classList.add('collapsed');
    bodyEl.classList.remove('expanded');
  }
}

window.expandOverlay = function () {
  const bodyEl = document.querySelector('body');

  if (bodyEl) {
    bodyEl.classList.remove('collapsed');
    bodyEl.classList.add('expanded');

    if (bodyEl.classList.contains('shorter')) {
      const inputEl = document.querySelector('.js-yext-query');
      inputEl && inputEl.focus();
    }
  }
}
