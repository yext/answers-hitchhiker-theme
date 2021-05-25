/**
 * Responsible for managing the RuntimeConfig object from the parent of an iframe
 */
export class RuntimeConfig {
  constructor () {
    this._runtimeConfig = document.querySelector('#answers-container')?.dataset ?? {};
    this._lastUpdated = Date.now();
  }

  getObject () {
    return { 
      ...this._runtimeConfig,
      lastUpdated: this._lastUpdated
    };
  }

  set (key, value) {
    this._validate(key, value);
    this._runtimeConfig[key] = value;
    this._lastUpdated = Date.now();
  }

  get (key) {
    return this._runtimeConfig[key];
  }

  _validate (key, value) {
    const newConfig = {
      ...this._runtimeConfig,
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