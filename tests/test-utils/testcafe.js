import { ClientFunction } from 'testcafe';
import IE11NoCacheHook from './ie11nocachehook';

/**
 * Register the Ie11NoCacheHook, if the current browser is IE11.
 *
 * @param {import('testcafe').TestController} testInstance
 * @param {string} url
 */
 export async function registerIE11NoCacheHook (testInstance, url) {
  const isIE11 = await ClientFunction(() => {
    return !!window.MSInputMethodContext && !!document.documentMode;
  })();
  if (isIE11) {
    const ie11Hook = new IE11NoCacheHook(url);
    return testInstance.addRequestHooks(ie11Hook);
  }
}