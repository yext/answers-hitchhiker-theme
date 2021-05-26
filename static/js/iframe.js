import { generateIFrame, sendToIframe } from './iframe-common';
import InjectedData from './models/InjectedData';
import generateInitAnswersFrame from './utils/generateInitAnswersFrame';
import { RuntimeConfig } from './runtime-config';

const runtimeConfig = new RuntimeConfig();
window.setRuntimeConfig = (key, value) => {
  runtimeConfig.set(key, value);
  sendToIframe({ runtimeConfig: runtimeConfig.getObject() });
}

const domain = new InjectedData().getDomain();
generateIFrame(domain, runtimeConfig);

window.initAnswersExperienceFrame = generateInitAnswersFrame(runtimeConfig);