import InjectedData from './models/InjectedData';
import getInitAnswersFrame from './utils/getInitAnswersFrame';
import { HitchhikerConfigManager, exposeOnWindow } from './hitchhikerconfigmanager';

const hitchhikerConfigManager = new HitchhikerConfigManager();
exposeOnWindow(hitchhikerConfigManager);

const domain = new InjectedData().getDomain();
window.initAnswersFrame = getInitAnswersFrame(domain, hitchhikerConfigManager);