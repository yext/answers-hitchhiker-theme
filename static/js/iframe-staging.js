import { generateIFrame, sendToIframe } from './iframe-common';
import InjectedData from './models/InjectedData';
import generateInitAnswersFrame from './utils/generateInitAnswersFrame';
import { RuntimeConfig } from './runtime-config';

const runtimeConfig = new RuntimeConfig();
window.setRuntimeConfig = (key, value) => {
  runtimeConfig.set(key, value);
  sendToIframe({ runtimeConfig: runtimeConfig.getObject() });
}

const stagingDomain = new InjectedData().getStagingDomain();
generateIFrame(stagingDomain, runtimeConfig);

window.initAnswersExperienceFrame = generateInitAnswersFrame(runtimeConfig);
