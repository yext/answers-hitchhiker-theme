require('iframe-resizer');

let iframeInitialized = false;
const iframeMessageQueue = [];

/**
 * @typedef {import('./runtime-config')} RuntimeConfig
 */

/**
 * Puts an iframe on the page of an Answers experience and sets up resizing and cross-domain communication
 * 
 * @param {string} domain The location of the answers experience
 * @param {AnswersExperienceFrame} answersExperienceFrame
 */
export function generateIFrame(domain, answersExperienceFrame) {
  var isLocalHost = window.location.host.split(':')[0] === 'localhost';
  var containerEl = document.querySelector('#answers-container');
  var iframe = document.createElement('iframe');
  var pathToIndex = containerEl.dataset.path;
  iframe.allow = 'geolocation; microphone';

  domain = domain || '';

  var calcFrameSrc = function() {
    var paramString = window.location.search;
    paramString = paramString.substr(1, paramString.length);

    // Parse the params out of the URL
    var params = paramString.split('&'),
                 verticalUrl;
    var referrerPageUrl = document.referrer.split('?')[0].split('#')[0];

    if (pathToIndex) {
      verticalUrl = pathToIndex;
    } else if (isLocalHost) {
      verticalUrl = 'index.html'; // Default for localhost is index.html, empty o/w
    }

    // Don't include the verticalUrl or raw referrerPageUrl in the frame src
    var new_params = params.filter(function(param) {
       return (param.split('=')[0] !== 'verticalUrl') &&
        (param.split('=')[0] !== 'referrerPageUrl');
    });

    for (var i = 0; i < params.length; i ++) {
      var kv = params[i].split('=');
      if (kv[0] === 'verticalUrl') {
        verticalUrl = kv[1];
      }

      if (kv[0] === 'referrerPageUrl') {
        referrerPageUrl = kv[1];
      }
    }

    new_params.push('referrerPageUrl=' + referrerPageUrl);

    // Build the Iframe URL
    var iframeUrl = domain;
    if (verticalUrl) {
      iframeUrl += '/' + verticalUrl;
    }

    iframeUrl += '?' + new_params.join('&');
    return iframeUrl;
  };
  
  iframe.src = calcFrameSrc();
  iframe.frameBorder = 0;

   // For dynamic iFrame sizing
  iframe.style.width = '1px';
  iframe.style.minWidth = '100%';
  iframe.id = 'answers-frame';

  // Scroll to the top of the page when the iframe loads or a link is clicked.
  iframe.addEventListener('load', () => {
    document.documentElement.scrollTop = 0;
    // For Safari
    document.body.scrollTop = 0;
  });
  registerPopStateListener();
  containerEl.appendChild(iframe);

  // Notify iframe of a click event on parent window
  document.addEventListener('click', e => {
    if (e.isTrusted) {
      sendToIframe({ eventType: e.type });
    }
  });

  // For dynamic iFrame resizing
  iFrameResize({
    checkOrigin: false,
    onInit: function() {
      iframeInitialized = true;
      iframeMessageQueue.push({
        initAnswersExperience: answersExperienceFrame.hasManuallyInitialized(),
        runtimeConfig: answersExperienceFrame.runtimeConfig.getAll()
      });
      while (iframeMessageQueue.length !== 0) {
        sendToIframe(iframeMessageQueue.shift());
      }
    },
    onMessage: function(messageData) {
      const message = JSON.parse(messageData.message);
      if (message.action === "paginate") {
        const iframeOffsetTop = iframe.offsetTop;
        document.documentElement.scrollTop = iframeOffsetTop;
        document.body.scrollTop = iframeOffsetTop; // For Safari
        return;
      }
      if (message.action === 'answers-initialized') {
        sendToIframe({
          action: 'update-tab-navigation',
          parentUrl: window.location.href
        });
        return;
      }
      const params = message.params;
      const pageTitle = message.pageTitle;
      pageTitle && (iframe.title = pageTitle);
      iframe.iFrameResizer.resize();
      var currLocation = window.location.href.split('?')[0];
      var newLocation = currLocation + '?' + params;
      if (window.location.href !== newLocation) {
        history.replaceState({query: params}, window.document.title, newLocation);
      }
    }
  }, '#answers-frame');
}

function registerPopStateListener() {
  let previousLocationHref = window.location.href;

  /**
   * Reloads the iframe with a recalculated src URL.
   * Does not reload the iframe if the URL has only changed its hash param. 
   */
  function popStateListener() {
    /** @param {string} url  */
    function getURLWithoutHash(url) {
      return url.split('#')[0];
    }
    if (getURLWithoutHash(previousLocationHref) !== getURLWithoutHash(window.location.href)) {
      iframe.contentWindow.location.replace(calcFrameSrc());
    }
    previousLocationHref = window.location.href;
  }
  window.addEventListener('popstate', popStateListener);
}

/**
 * Sends data to the answers iframe if possible. Otherwise the message is queued
 * so that it can be sent when the iframe initializes.
 * @param {Object} obj 
 */
export function sendToIframe (obj) {
  const iframe = document.querySelector('#answers-frame');
  if (!iframe || !iframe.iFrameResizer || !iframeInitialized) {
    iframeMessageQueue.push(obj);
  }
  else {
    iframe.iFrameResizer.sendMessage(obj);
  }
}