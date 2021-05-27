import { generateIFrame, sendToIframe } from './iframe-common';
import InjectedData from './models/InjectedData';
import generateInitAnswersExperienceFrameFunction from './utils/generateInitAnswersExperienceFrameFunction';
import { RuntimeConfig } from './runtime-config';

const runtimeConfig = new RuntimeConfig();
window.setRuntimeConfig = (key, value) => {
  runtimeConfig.set(key, value);
  sendToIframe({ runtimeConfig: runtimeConfig.getObject() });
}

const prodDomain = new InjectedData().getProdDomain();
generateIFrame(prodDomain, runtimeConfig);

window.initAnswersExperienceFrame = generateInitAnswersExperienceFrameFunction(runtimeConfig);
