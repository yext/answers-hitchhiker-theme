// Note: This will need to be updated to 'createMockFromModule' if we upgrade to jest 26+
const iframeCommon = jest.genMockFromModule('./iframe-common');

iframeCommon.sendToIframe = jest.fn();

module.exports = iframeCommon;