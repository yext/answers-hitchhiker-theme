/**
 * A data model for runtime configuration
 */
export class RuntimeConfig {
  constructor (initialConfig = {}) {
    this._data = { ...initialConfig };
    this._lastUpdated = Date.now();
    this._onUpdateListener = () => {};
  }

  get (key) {
    return this._data[key];
  }

  getObject () {
    return { 
      ...this._data,
      lastUpdated: this._lastUpdated
    };
  }

  set (key, value) {
    this._validateSet(key, value);
    this._data[key] = value;
    this._lastUpdated = Date.now();
    this._onUpdateListener();
  }

  setAll (object) {
    this._validateSetAll(object);
    this._data= {
      ...this._data,
      ...object
    };
    this._lastUpdated = Date.now();
    this._onUpdateListener();
  }

  onUpdate (cb) {
    this._onUpdateListener = cb;
  }

  _validateSet (key, value) {
    const newConfig = {
      ...this._data,
      [key]: value
    };
    try {
      JSON.stringify(newConfig);
    } catch (e) {
      console.error(`Cannot set the key ${key} and value ${value} because the resulting object would not be JSON serializable`);
      throw e;
    }
  }

  _validateSetAll (object) {
    const newConfig = {
      ...this._data,
      ...object
    };
    try {
      JSON.stringify(newConfig);
    } catch (e) {
      console.error(`Cannot set all with the object ${object} because the resulting object would not be JSON serializable`);
      throw e;
    }
  }
}