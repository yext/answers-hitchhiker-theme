import { generateIFrame } from './iframe-common';
import InjectedData from './models/injecteddata';

const domain = new InjectedData().getDomain();
generateIFrame(domain);
