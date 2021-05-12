import getHHConfigAttributes from './utils/getHHConfigAttributes';

/**
 * Responsible for managing the HitchhikerConfig object from the parent of an iframe
 */
export class HitchhikerConfigManager {
  constructor () {
    this._hitchhikerConfig = getHHConfigAttributes('#answers-container');
  }

  getObject () {
    return { ...this._hitchhikerConfig };
  }

  set (key, value) {
    this._validate(key, value);
    this._hitchhikerConfig[key] = value;
  }

  sendConfigToIframe() {
    const iframe = document.querySelector('#answers-frame');
    if (!iframe || !iframe.iFrameResizer) {
      return;
    }
    iframe.iFrameResizer.sendMessage({
      hitchhikerConfig: this.getObject(),
      timestamp: Date.now()
    });
  }

  _validate (key, value) {
    const newConfig = {
      ...this._hitchhikerConfig,
      [key]: value
    }
    try {
      JSON.stringify(newConfig);
    } catch (e) {
      console.error(`Cannot set the key ${key} and value ${value} because the resulting object would not be JSON serializable`);
      throw e;
    }
  }
}

/**
 * 
 *  
 * @param {HitchhikerConfigManager} hitchhikerConfigManager 
 */
export function exposeOnWindow (hitchhikerConfigManager) {
  window.setHitchhikerConfig = function (key, value) {
    hitchhikerConfigManager.set(key, value);
    hitchhikerConfigManager.sendConfigToIframe();
  }
}