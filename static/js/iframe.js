import { generateIFrame } from './iframe-common';
import InjectedData from './models/InjectedData';
import RuntimeConfig from './runtime-config';
import AnswersExperienceFrame from './answers-experience-frame';

const runtimeConfig = new RuntimeConfig();
const answersExperienceFrame = new AnswersExperienceFrame(runtimeConfig);
window.AnswersExperienceFrame = answersExperienceFrame;

const domain = new InjectedData().getDomain();
generateIFrame(domain, answersExperienceFrame);