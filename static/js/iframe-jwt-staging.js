import { generateIFrame } from './iframe-common';
import InjectedData from './models/InjectedData';

const stagingDomain = new InjectedData().getStagingDomain();

window.initAnswersFrameJWT = function (token) {
  generateIFrame(stagingDomain, null, null, token);
}