/**
 * Add code here to send messages to the parent site for iframe integrations.
 * To listen to these messages, static/js/iframe-common.js must be overriden
 * and the iFrameResize onMessage function must be modified.
 */

ANSWERS.core.storage.registerListener({
  eventType: 'update',
  storageKey: 'query-id',
  callback: id => {
    window.parentIFrame.sendMessage(JSON.stringify({
      queryId: id,
      sessionId: ANSWERS.core.getOrSetupSessionId()
    }));
  }
});