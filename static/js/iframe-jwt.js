import { generateIFrame } from './iframe-common';
import InjectedData from './models/InjectedData';

const domain = new InjectedData().getDomain();

window.initAnswersFrame = function (token) {
  generateIFrame(domain, null, null, token);
}