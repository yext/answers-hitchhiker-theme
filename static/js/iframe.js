import { generateIFrame, sendToIframe } from './iframe-common';
import InjectedData from './models/InjectedData';
import generateInitAnswersExperienceFrameFunction from './utils/generateInitAnswersExperienceFrameFunction';
import { RuntimeConfig } from './runtime-config';

const answersDataAttributes = document.querySelector('#answers-container')?.dataset;
const runtimeConfig = new RuntimeConfig(answersDataAttributes);
runtimeConfig.onUpdate(() => {
  sendToIframe({ runtimeConfig: runtimeConfig.getObject() });
});
window.AnswersExperienceFrame = {
  runtimeConfig: runtimeConfig,
  init: generateInitAnswersExperienceFrameFunction(runtimeConfig)
};

const domain = new InjectedData().getDomain();
generateIFrame(domain, runtimeConfig);