import { generateIFrame } from './iframe-common';
import InjectedData from './models/injecteddata';

const stagingDomain = new InjectedData().getStagingDomain();
generateIFrame(stagingDomain);
