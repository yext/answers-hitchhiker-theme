export default function (config) {
  window.RuntimeConfig = {
    ...window.RuntimeConfig,
    ...config
  };
}