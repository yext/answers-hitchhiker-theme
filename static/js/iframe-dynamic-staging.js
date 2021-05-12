import InjectedData from './models/InjectedData';
import getInitAnswersFrame from './utils/getInitAnswersFrame';
import { HitchhikerConfigManager, exposeOnWindow } from './hitchhikerconfigmanager';

const hitchhikerConfigManager = new HitchhikerConfigManager();
exposeOnWindow(hitchhikerConfigManager);

const stagingDomain = new InjectedData().getStagingDomain();
window.initAnswersFrame = getInitAnswersFrame(stagingDomain, hitchhikerConfigManager);