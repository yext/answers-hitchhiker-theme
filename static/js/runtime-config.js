import { canonicalizeBoolean } from './utils';

/**
 * @typedef {Object} RuntimeConfigListener
 * @property {string} eventType Event type to trigger this listener. Defaults to 'update'
 * @property {string} key If supplied, the listener is associated with this key.
 *                    Otherwise, listener is attached to all keys.
 * @property {string} valueType Indicates that when a value is set on the associated key,
 *                    the value should be canonicalized to the specified type. For
 *                    example, for valueType of 'boolean', values will be canoncicalized
 *                    to boolean. Only applicable when a key is specified.
 * @property {Function} callback Function to invoke upon event trigger
 */

/**
 * A data model for runtime configuration
 */
export default class RuntimeConfig {
  constructor (initialConfig = {}) {
    this._data = { ...initialConfig };
    
    /**
     * Listeners that apply to all keys
     * @type {Object[]}
     */
    this._generalListeners = [];
    
    /**
     * Listeners that apply to specific keys
     * @type {Map<string:Object[]>}
     */
    this._keySpecificListeners = {};
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
    this._callGeneralListeners('update');
    this._callKeySpecificListeners('update', key);
  }

  /**
   * Adds a listener for a given key, or any time RuntimeConfig is 
   * updated if there's no key provided.
   *
   * @param {RuntimeConfigListener}
   */
  registerListener (listener) {
    if (!listener.callback || typeof listener.callback !== 'function') {
      throw new Error(`Invalid listener applied in runtimeConfig: ${listener}`);
    }
    if(!listener.eventType) {
      listener.eventType = 'update';
    }
    if (listener.key) {
      this._keySpecificListeners[listener.key]
      ? this._keySpecificListeners[listener.key].push(listener)
      : this._keySpecificListeners[listener.key] = [listener];
    } else {
      this._generalListeners.push(listener);
    }
  }

  /**
   * Trigger all general listeners that match the event type
   * 
   * @param {string} eventType
   */
  _callGeneralListeners (eventType) {
    this._generalListeners.forEach((listener) => {
      if (listener.eventType === eventType) {
        listener.callback(this.getAll());
      }
    });
  }

  /**
   * Trigger all key-specific listeners that match the key and event type
   * 
   * @param {string} eventType
   * @param {string} key
   */
  _callKeySpecificListeners (eventType, key) {
    if (this._keySpecificListeners[key]) {
      this._keySpecificListeners[key].forEach((listener) => {
        if (listener.eventType !== eventType) {
          return;
        }
        let value = this.get(key);
        if (listener.valueType === 'boolean') {
          value = canonicalizeBoolean(value);
        }
        listener.callback(value);
      });
    }
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