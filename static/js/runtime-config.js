/**
 * A data model for runtime configuration
 */
export default class RuntimeConfig {
  constructor (initialConfig = {}) {
    this._data = { ...initialConfig };
    this._onUpdateListener = () => {};
  }

  /**
   * Returns the value assocaited with a key
   * @param {string} key 
   * @returns {*}
   */
  get (key) {
    return this._data[key];
  }

  /**
   * Returns an object representation of the runtime config
   * @returns {*}
   */
  getAll () {
    return { ...this._data };
  }

  /**
   * Sets a value of the config
   * @param {string} key 
   * @param {*} value 
   */
  set (key, value) {
    this._validateSet(key, value);
    this._data[key] = value;
    this._onUpdateListener(this.getAll());
  }

  /**
   * A function which is called any time the RuntimeConfig is updated
   * @param {Function} cb 
   */
  _onUpdate (cb) {
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
}