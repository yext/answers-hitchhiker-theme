import { generateIFrame } from './iframe-common';
import InjectedData from './models/InjectedData';
import getJwtNotProvidedTimeout from './utils/getJwtNotProvidedTimeout';

const domain = new InjectedData().getDomain();
const jwtNotProvidedTimeout = getJwtNotProvidedTimeout();

window.initAnswersFrameJWT = function (token) {
  clearTimeout(jwtNotProvidedTimeout);
  generateIFrame(domain, null, null, token);
}