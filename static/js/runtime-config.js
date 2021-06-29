/**
 * A data model for runtime configuration
 */
export default class RuntimeConfig {
  constructor (initialConfig = {}) {
    this._data = { ...initialConfig };
    this._listeners = [];
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
    this._callListeners('update', key);
  }

  /**
   * Adds a listener for a given key, or any time RuntimeConfig is 
   * updated if there's no key provided.
   *
   * @param {*} listener the listener to add
   * @param {string} listener.eventType event type to trigger this listener
   * @param {string} listener.key if given, listener is attached to this key. Otherwise, listener is attached to all keys.
   * @param {Function} listener.callback function to invoke on event triggered
   */
  registerListener (listener) {
    if (!listener.eventType || !listener.callback || typeof listener.callback !== 'function') {
      throw new Error(`Invalid listener applied in runtimeConfig: ${listener}`);
    }
    this._listeners.push(listener);
  }

  /**
   * Trigger all generic and key-specific listener(s) that match the event type
   * 
   * @param {string} eventType
   * @param {string} key
   */
  _callListeners (eventType, key) {
    this._listeners.forEach((listener) => {
      if (listener.eventType === eventType) {
        if (!listener.key) {
          listener.callback(this.getAll());
        } else if (listener.key === key) {
          listener.callback(this.get(key));
        }
      }
    });
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