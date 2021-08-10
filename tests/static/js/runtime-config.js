import RuntimeConfig from '../../../static/js/runtime-config';

describe('Runtime config data model functionality', () => {
  it('Can set and get data', () => {
    const runtimeConfig = new RuntimeConfig();
    runtimeConfig.set('linkTarget', '_blank');
    const linkTarget = runtimeConfig.get('linkTarget');
    expect(linkTarget).toEqual('_blank');
  });

  it('The getAll function works', () => {
    const runtimeConfig = new RuntimeConfig();
    runtimeConfig.set('linkTarget', '_blank');
    runtimeConfig.set('color', 'red');
    const actualData = runtimeConfig.getAll();
    const expectedData = {
      linkTarget: '_blank',
      color: 'red'
    };
    expect(actualData).toEqual(expectedData);
  });

  it('generic listener callback is called when data is set', () => {
    const runtimeConfig = new RuntimeConfig();
    const mockCallback = jest.fn();
    runtimeConfig.registerListener({
      eventType: 'update',
      callback: mockCallback});
    runtimeConfig.set('linkTarget', '_blank');
    expect(mockCallback).toHaveBeenCalled();
  });

  it('key-specific listener callback is called only when the corresponding key\'s data is set', () => {
    const runtimeConfig = new RuntimeConfig();
    const mockCallback = jest.fn();
    runtimeConfig.registerListener({
      eventType: 'update',
      key: 'linkTarget',
      callback: mockCallback});
    runtimeConfig.set('someConfig', 'someValue');
    expect(mockCallback).not.toHaveBeenCalled();
    runtimeConfig.set('linkTarget', '_blank');
    expect(mockCallback).toHaveBeenCalled();
  });

  it('An error is thrown if the setter receives data which is not JSON serializable', () => {
    const runtimeConfig = new RuntimeConfig();
    const setNonSerializableData = () => {
      const circularReference = {};
      circularReference.myself = circularReference;
      runtimeConfig.set('linkTarget', circularReference);
    };
    expect(setNonSerializableData).toThrowError();
  });
});