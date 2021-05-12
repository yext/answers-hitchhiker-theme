import { generateIFrame } from './iframe-common';
import InjectedData from './models/InjectedData';
import { HitchhikerConfigManager, exposeOnWindow } from './hitchhikerconfigmanager';

const hitchhikerConfigManager = new HitchhikerConfigManager();
exposeOnWindow(hitchhikerConfigManager);

const prodDomain = new InjectedData().getProdDomain()
generateIFrame(prodDomain, hitchhikerConfigManager);
