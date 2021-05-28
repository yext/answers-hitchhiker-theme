import { generateIFrame } from './iframe-common';
import InjectedData from './models/InjectedData';
import RuntimeConfig from './runtime-config';
import AnswersExperienceFrame from './answers-experience-frame';

const runtimeConfig = new RuntimeConfig();
window.AnswersExperienceFrame = new AnswersExperienceFrame(runtimeConfig);

const stagingDomain = new InjectedData().getStagingDomain();
generateIFrame(stagingDomain, runtimeConfig);