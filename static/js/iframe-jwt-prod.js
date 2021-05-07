import { generateIFrame } from './iframe-common';
import InjectedData from './models/InjectedData';
import getJwtNotProvidedTimeout from './utils/getJwtNotProvidedTimeout';

const prodDomain = new InjectedData().getProdDomain();
const jwtNotProvidedTimeout = getJwtNotProvidedTimeout();

window.initAnswersFrameJWT = function (token) {
  clearTimeout(jwtNotProvidedTimeout);
  generateIFrame(prodDomain, null, null, token);
}