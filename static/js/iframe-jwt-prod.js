import { generateIFrame } from './iframe-common';
import InjectedData from './models/InjectedData';

const prodDomain = new InjectedData().getProdDomain();

window.initAnswersFrameJWT = function (token) {
  generateIFrame(prodDomain, null, null, token);
}