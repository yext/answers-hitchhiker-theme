import { generateIFrame } from './iframe-common';
import InjectedData from './models/InjectedData';

const stagingDomain = new InjectedData().getStagingDomain();
generateIFrame(stagingDomain);
