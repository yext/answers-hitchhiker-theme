import { generateIFrame } from './iframe-common';
import InjectedData from './models/InjectedData';

const domain = new InjectedData().getDomain();
generateIFrame(domain);
