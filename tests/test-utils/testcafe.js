import { ClientFunction } from 'testcafe';
import IE11NoCacheHook from './ie11nocachehook';

/**
 * Register the Ie11NoCacheHook, if the current browser is IE11.
 *
 * @param {import('testcafe').TestController} testInstance
 */
 export async function registerIE11NoCacheHook (testInstance) {
  const isIE11 = await ClientFunction(() => {
    return !!window.MSInputMethodContext && !!document.documentMode;
  })();
  if (isIE11) {
    const ie11Hook = new IE11NoCacheHook(/v2\/accounts\/me\/answers\/vertical\/query/);
    return testInstance.addRequestHooks(ie11Hook);
  }
}