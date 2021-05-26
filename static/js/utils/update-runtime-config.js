/**
 * Updates the RuntimeConfig object such that it contains the provided data
 *
 * @param {Object} config 
 */
export default function updateRuntimeConfig (config) {
  window.RuntimeConfig = {
    ...window.RuntimeConfig,
    ...config
  };
}