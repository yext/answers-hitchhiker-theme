export default class DeferredPromise {
  constructor(handler = null) {
    this._promise = new Promise((resolve, reject)=> {
      this.resolve = resolve
      this.reject = reject
      
      if(handler) {
        handler(resolve, reject);
      }
    });
    
    this.then = this._promise.then.bind(this._promise);
    this.catch = this._promise.catch.bind(this._promise);
  }
}