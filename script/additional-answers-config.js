// This file expects a JS object literal. 
{
  querySource: (() => {
    const context = (new URLSearchParams(window.location.search)).get('context');
    try {
      return JSON.parse(context ?? '{}').querySource;
    } catch (err) {
      console.warn('Error parsing querySource from context');
      console.warn(err)
      return 'STANDARD';
    }
  })()
}