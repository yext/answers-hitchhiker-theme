import { generateIFrame, sendToIframe } from './iframe-common';
import InjectedData from './models/InjectedData';
import generateInitAnswersFrame from './utils/generateInitAnswersFrame';
import { RuntimeConfig } from './runtimeconfig';

const runtimeConfig = new RuntimeConfig();
window.setRuntimeConfig = (key, value) => {
  runtimeConfig.set(key, value);
  sendToIframe({
    runtimeConfig: runtimeConfig.getObject()
  });
}

const stagingDomain = new InjectedData().getStagingDomain();

if (runtimeConfig.get('waitForRuntimeConfig') === 'true') {
  window.initAnswersExperienceFrame = generateInitAnswersFrame(stagingDomain, runtimeConfig);
} else {
  generateIFrame(stagingDomain, runtimeConfig);
}
