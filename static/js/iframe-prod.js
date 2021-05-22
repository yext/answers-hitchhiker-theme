import { generateIFrame, sendToIframe } from './iframe-common';
import InjectedData from './models/InjectedData';
import generateInitAnswersFrame from './utils/generateInitAnswersFrame';
import { RuntimeConfig } from './runtimeconfig';

const runtimeConfig = new RuntimeConfig();
window.setRuntimeConfig = (key, value) => {
  runtimeConfig.set(key, value);
  sendToIframe({ runtimeConfig: runtimeConfig.getObject() });
}

const prodDomain = new InjectedData().getProdDomain();

if (runtimeConfig.get('waitForRuntimeConfig') === 'true') {
  window.initAnswersExperienceFrame = generateInitAnswersFrame(prodDomain, runtimeConfig);
} else {
  generateIFrame(prodDomain, runtimeConfig);
}
