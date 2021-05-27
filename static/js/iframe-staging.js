import { generateIFrame, sendToIframe } from './iframe-common';
import InjectedData from './models/InjectedData';
import generateInitAnswersExperienceFrameFunction from './utils/generateInitAnswersExperienceFrameFunction';
import { RuntimeConfig } from './runtime-config';

const runtimeConfig = new RuntimeConfig();
window.setRuntimeConfig = (key, value) => {
  runtimeConfig.set(key, value);
  sendToIframe({ runtimeConfig: runtimeConfig.getObject() });
}

const stagingDomain = new InjectedData().getStagingDomain();
generateIFrame(stagingDomain, runtimeConfig);

window.initAnswersExperienceFrame = generateInitAnswersExperienceFrameFunction(runtimeConfig);
