export function generateIFrame(domain, queryParam, urlParam) {
  var isLocalHost = window.location.host.split(':')[0] === 'localhost';
  var containerEl = document.querySelector('#answers-container');
  var iframe = document.createElement('iframe');
  iframe.allow = 'geolocation';

  domain = domain || '';
  queryParam = queryParam || 'query';
  urlParam = urlParam || 'verticalUrl';

  var calcFrameSrc = function() {
    var paramString = window.location.search;
    paramString = paramString.substr(1, paramString.length);

    // Parse the params out of the URL
    var params = paramString.split('&'),
                 verticalUrl;
    var referrerPageUrl = document.referrer.split('?')[0].split('#')[0];

    // Default for localhost is index.html, empty o/w
    if (isLocalHost) {
      verticalUrl = 'index.html';
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
  // For dynamic iFrame resizing
  var resizer = document.createElement('script');

  resizer.onload = function() {
    iFrameResize({
      //log: true,
      checkOrigin: false,
      onMessage: function(data) {
        iframe.iFrameResizer.resize();
        var currLocation = window.location.href.split('?')[0];
        var newLocation = currLocation + '?' + data.message;
        if (window.location.href !== newLocation) {
          history.pushState({query: data.message}, window.document.title, newLocation);
        }
      }
    }, '#answers-frame');
  };
  resizer.src = "https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/4.1.1/iframeResizer.min.js";
  document.body.appendChild(resizer);

  iframe.src = calcFrameSrc();
  iframe.frameBorder = 0;

   // For dynamic iFrame sizing
  iframe.style.width = '1px';
  iframe.style.minWidth = '100%';
  iframe.id = 'answers-frame';

  window.onpopstate = function() {
    iframe.contentWindow.location.replace(calcFrameSrc());
  };

  containerEl.appendChild(iframe);
}
