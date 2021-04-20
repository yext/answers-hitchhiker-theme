import findFirst from '../../hbshelpers/findFirst';

describe('returns the first truthy value', () => {
  it('string', () => {
    expect(findFirst(0, false, '', 'hi!', {})).toEqual('hi!');
  });
  it('boolean', () => {
    expect(findFirst(0, false, '', true, {})).toEqual(true);
  });
  it('number', () => {
    expect(findFirst(0, false, '', 1, {})).toEqual(1);
  });
  it('no value found', () => {
    expect(findFirst(0, false, '')).toBeFalsy;
  });
});
