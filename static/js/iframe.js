import { generateIFrame, sendToIframe } from './iframe-common';
import InjectedData from './models/InjectedData';
import generateInitAnswersFrame from './utils/generateInitAnswersFrame';
import { RuntimeConfig } from './runtimeconfig';

const runtimeConfig = new RuntimeConfig();
window.setRuntimeConfig = (key, value) => {
  runtimeConfig.set(key, value);
  sendToIframe({ runtimeConfig: runtimeConfig.getObject() });
}

const domain = new InjectedData().getDomain();

if (runtimeConfig.get('waitForRuntimeConfig') === 'true') {
  window.initAnswersExperienceFrame = generateInitAnswersFrame(domain, runtimeConfig);
} else {
  generateIFrame(domain, runtimeConfig);
}
