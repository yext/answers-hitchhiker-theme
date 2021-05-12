import InjectedData from './models/InjectedData';
import getInitAnswersFrame from './utils/getInitAnswersFrame';
import { HitchhikerConfigManager, exposeOnWindow } from './hitchhikerconfigmanager';

const hitchhikerConfigManager = new HitchhikerConfigManager();
exposeOnWindow(hitchhikerConfigManager);

const prodDomain = new InjectedData().getProdDomain();
window.initAnswersFrame = getInitAnswersFrame(prodDomain, hitchhikerConfigManager);