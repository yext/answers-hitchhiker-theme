import { generateIFrame } from './iframe-common';
import InjectedData from './models/InjectedData';

const prodDomain = new InjectedData().getProdDomain()
generateIFrame(prodDomain);
