/**
 * a Promise wrapper class that exposes resolve() and reject() so its state can
 * be defer and settle outside of a promise constructor. It carries over some
 * main methods of Promise, which invoke the corresponding methods bound to the
 * inner promise created in this class.
 */
export default class DeferredPromise {
  constructor(stateHandler = null) {
    this._promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
      
      if (stateHandler) {
        stateHandler(resolve, reject);
      }
    });
    
    this.then = Promise.prototype.then.bind(this._promise);
    this.catch = Promise.prototype.catch.bind(this._promise);
    this.finally = Promise.prototype.finally.bind(this._promise);
  }
}
