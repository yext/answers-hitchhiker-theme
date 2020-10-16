import { generateIFrame } from './iframe-common';
import InjectedData from './models/injecteddata';

const prodDomain = new InjectedData().getProdDomain()
generateIFrame(prodDomain);
