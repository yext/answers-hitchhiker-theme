import { generateIFrame } from './iframe-common';
import InjectedData from './models/InjectedData';
import getJwtNotProvidedTimeout from './utils/getJwtNotProvidedTimeout';

const stagingDomain = new InjectedData().getStagingDomain();
const jwtNotProvidedTimeout = getJwtNotProvidedTimeout();

window.initAnswersFrameJWT = function (token) {
  clearTimeout(jwtNotProvidedTimeout);
  generateIFrame(stagingDomain, null, null, token);
}