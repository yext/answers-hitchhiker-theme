require('iframe-resizer');

export function generateIFrame(domain, queryParam, urlParam) {
  var isLocalHost = window.location.host.split(':')[0] === 'localhost';
  var containerEl = document.querySelector('#answers-container');
  var iframe = document.createElement('iframe');
  var pathToIndex = containerEl.dataset.path;
  iframe.allow = 'geolocation';

  domain = domain || '';
  queryParam = queryParam || 'query';
  urlParam = urlParam || 'verticalUrl';

  var calcFrameSrc = function() {
    var paramString = window.location.search;
    paramString = paramString.substr(1, paramString.length);

    // Decode ASCII forward slash to avod repeat encodings on page refreshes
    paramString = paramString.replace("%2F", "/");

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

  window.onpopstate = function() {
    iframe.contentWindow.location.replace(calcFrameSrc());
  };

  containerEl.appendChild(iframe);

  // For dynamic iFrame resizing
  iFrameResize({
    checkOrigin: false,
    onMessage: function(messageData) {
      const message = JSON.parse(messageData.message);
      if (message.action === "paginate") {
        const iframeOffsetTop = iframe.offsetTop;
        document.documentElement.scrollTop = iframeOffsetTop;
        document.body.scrollTop = iframeOffsetTop; // For Safari
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
